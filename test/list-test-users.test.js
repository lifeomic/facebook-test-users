const map = require('lodash/map');
const pick = require('lodash/pick');
const test = require('ava');
const testUsers = require('..');
const uuid = require('uuid/v4');

const { useFacebookMock } = require('./helpers/facebook');

useFacebookMock(test);

test.beforeEach(async (test) => {
  const { appId, appSecret } = test.context.facebook;
  test.context.client = await testUsers.createClient({ appId, appSecret });
});

test.serial('listing test users when none are available returns an empty list', async (test) => {
  const { client } = test.context;
  const users = await client.listTestUsers();
  test.deepEqual(users, []);
});

test.serial('listing test users traverses all pages', async (test) => {
  const { client, facebook } = test.context;
  facebook.users.createUsers(5);

  const users = await client.listTestUsers();
  test.deepEqual(users, map(facebook.users, (user) => user.appView()));
});

test.serial('listing test users can include additional fields', async (test) => {
  const { client, facebook } = test.context;
  facebook.users.createUsers(5, () => ({ name: uuid() }));

  const users = await client.listTestUsers({ includeFields: [ 'name' ] });
  test.deepEqual(users, map(facebook.users, (user) => pick(user, 'access_token', 'id', 'login_url', 'name')));
});
