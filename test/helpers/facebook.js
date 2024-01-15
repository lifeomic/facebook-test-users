const nock = require('nock');
const noop = require('lodash/noop');
const pick = require('lodash/pick');
const set = require('lodash/set');
const uuid = require('uuid/v4');

const { URLSearchParams } = require('url');

const GRAPH_API_BASE = '/v18.0';
const GRAPH_API_HOST = 'https://graph.facebook.com';

const createContext = () => {
  return {
    accessToken: uuid(),
    appId: uuid(),
    appSecret: uuid(),
    users: new UserStore()
  };
};

const createPage = ({ after, items, url }) => {
  const previousIndex = items.findIndex((item) => item.id === after);
  const [ currentItem, nextItem ] = items.slice(previousIndex + 1, previousIndex + 3);
  const page = { data: [] };

  if (currentItem) {
    page.data.push(currentItem);
  }

  if (nextItem) {
    set(page, 'paging.next', `${url}?after=${currentItem.id}`);
  }

  return page;
};

const parseQueryString = (uri) => {
  const raw = uri.split('?')[1];
  return new URLSearchParams(raw);
};

const provideAccessTokens = ({ accessToken, appId, appSecret }) => {
  nock(GRAPH_API_HOST)
    .persist()
    .get((uri) => uri.startsWith(`${GRAPH_API_BASE}/oauth/access_token`))
    .reply(200, { access_token: accessToken, token_type: 'bearer' });
};

const provideTestUsers = ({ accessToken, appId, users }) => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const TEST_USER_RESOURCE = new RegExp(`^${GRAPH_API_BASE}/([^/?]+)`);

  nock(GRAPH_API_HOST)
    .persist()
    .matchHeader('authorization', `Bearer ${accessToken}`)
    .get((uri) => uri.startsWith(`${GRAPH_API_BASE}/${appId}/accounts`))
    .reply((uri) => {
      const query = parseQueryString(uri);

      const page = createPage({
        after: query.get('after'),
        items: users.map((user) => user.appView()),
        url: `${GRAPH_API_HOST}${GRAPH_API_BASE}/${appId}/accounts`
      });

      return [ 200, page ];
    });

  nock(GRAPH_API_HOST)
    .persist()
    .matchHeader('authorization', `Bearer ${accessToken}`)
    .post((uri) => uri.startsWith(`${GRAPH_API_BASE}/${appId}/accounts`))
    .reply((uri, body) => [ 200, users.createUser(body).publishView() ]);

  nock(GRAPH_API_HOST)
    .persist()
    .matchHeader('authorization', `Bearer ${accessToken}`)
    .get(TEST_USER_RESOURCE)
    .reply((uri) => {
      const [ , id ] = TEST_USER_RESOURCE.exec(uri);
      const query = parseQueryString(uri);
      const fields = query.has('fields') ? query.get('fields').split(',') : [];
      const user = users.getUserById(id);

      if (!user) {
        return [ 404, { error: `user ${id} not found` } ];
      }

      return [ 200, user.userView({ includeFields: fields }) ];
    });

  nock(GRAPH_API_HOST)
    .persist()
    .matchHeader('authorization', `Bearer ${accessToken}`)
    .delete(TEST_USER_RESOURCE)
    .reply((uri) => {
      const [ , id ] = TEST_USER_RESOURCE.exec(uri);
      const user = users.getUserById(id);

      if (!user) {
        return [ 404, { error: `user ${id} not found` } ];
      }

      users.deleteUserById(user.id);
      return [ 204 ];
    });
};

class User {
  constructor (options = {}) {
    this.access_token = uuid();
    this.email = `${uuid()}@example.com`;
    this.id = uuid();
    this.login_url = `https://example.com/login/${uuid()}`;
    this.password = uuid();
    Object.assign(this, this.options.call(options));
  }

  appView () {
    return pick(this, [ 'access_token', 'id', 'login_url' ]);
  }

  options () {
    return pick(this, 'installed', 'permissions', 'name', 'owner_access_token', 'uid');
  }

  publishView () {
    return pick(this, 'access_token', 'email', 'id', 'login_url', 'password');
  }

  userView (options = { includeFields: [] }) {
    const { includeFields } = options;
    return pick(this, [ 'id' ].concat(includeFields));
  }
}

class UserStore extends Array {
  createUser (options) {
    const user = new User(options);
    this.push(user);
    return user;
  }

  createUsers (count, optionsGenerator = noop) {
    for (let i = 0; i < count; i++) {
      this.createUser(optionsGenerator(i));
    }
  }

  deleteUserById (id) {
    let source = 0;
    let target = 0;

    for (; source < this.length; source++, target++) {
      const user = this[source]; // eslint-disable-line security/detect-object-injection

      if (user.id === id) {
        target--;
      } else {
        this[target] = user; // eslint-disable-line security/detect-object-injection
      }
    }

    this.length = target;
  }

  getUserById (id) {
    return this.find((user) => user.id === id);
  }
}

exports.useFacebookMock = (test) => {
  test.before(() => {
    nock.disableNetConnect();
  });

  test.beforeEach((test) => {
    const facebook = createContext();
    provideAccessTokens(facebook);
    provideTestUsers(facebook);

    test.context = {
      ...test.context,
      facebook
    };
  });

  test.afterEach((test) => {
    nock.cleanAll();
  });

  test.after(() => {
    nock.enableNetConnect();
  });
};
