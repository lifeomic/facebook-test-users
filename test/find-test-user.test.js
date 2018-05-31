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

test.serial('searching for a test user returns null if no users match', async (test) => {
  const { client, facebook } = test.context;
  facebook.users.createUsers(5);

  const user = await client.findTestUser({ name: 'alice' });
  test.is(user, null);
});

test.serial('searching for a test user returnns the first matching user', async (test) => {
  const { client, facebook } = test.context;
  facebook.users.createUsers(5, () => ({ name: uuid() }));

  const user = await client.findTestUser({ name: facebook.users[2].name });
  test.deepEqual(user, pick(facebook.users[2], 'access_token', 'id', 'login_url', 'name'));
});
