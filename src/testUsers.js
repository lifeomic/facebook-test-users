const axios = require('axios');
const find = require('lodash/find');
const get = require('lodash/get');
const merge = require('lodash/merge');
const zip = require('lodash/zip');

const GRAPH_API_BASE = 'https://graph.facebook.com/v10.0';

class Application {
  static async getAccessToken ({ appId, appSecret }) {
    const response = await axios.get(
      `${GRAPH_API_BASE}/oauth/access_token`,
      {
        params: {
          client_id: appId,
          client_secret: appSecret,
          grant_type: 'client_credentials'
        }
      }
    );

    return response.data.access_token;
  }

  constructor ({ accessToken, appId }) {
    this._appId = appId;

    this._client = axios.create({
      baseURL: GRAPH_API_BASE,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    this._testUsersUrl = `/${this._appId}/accounts`;
  }

  async createTestUser (options = {}) {
    const response = await this._client.post(
      this._testUsersUrl,
      options,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  }

  async deleteTestUser ({ id }) {
    await this._client.delete(`/${id}`);
  }

  async findTestUser (fields) {
    const fieldNames = Object.keys(fields);
    const users = await this.listTestUsers({ includeFields: fieldNames });
    return find(users, fields) || null;
  }

  async getTestUser ({ id, includeFields }) {
    const encodedFields = encodeURIComponent(includeFields.join(','));
    const response = await this._client.get(`/${id}?fields=${encodedFields}`);
    return response.data;
  }

  async listTestUsers (options = {}) {
    const { includeFields } = options;
    const users = await this._getAllPages(this._testUsersUrl);

    if (includeFields) {
      const userFields = await Promise.all(users.map((user) => this.getTestUser({ id: user.id, includeFields })));
      return zip(users, userFields)
        .map(([ user, fields ]) => merge(user, fields));
    }

    return users;
  }

  async _getAllPages (url) {
    const client = this._client;
    const results = [];

    let next = url;

    while (next) {
      const response = await client.get(next);
      results.push(...response.data.data);
      next = get(response, 'data.paging.next');
    }

    return results;
  }
}

exports.createClient = async ({ appId, appSecret }) => {
  const accessToken = await Application.getAccessToken({ appId, appSecret });
  return new Application({ accessToken, appId });
};
