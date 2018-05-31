const test = require('ava');
const testUsers = require('..');
const uuid = require('uuid/v4');

const { useFacebookMock } = require('./helpers/facebook');

useFacebookMock(test);

test.beforeEach(async (test) => {
  const { appId, appSecret } = test.context.facebook;
  test.context.client = await testUsers.createClient({ appId, appSecret });
});

test.serial('creating a new test user with the default options does not customize the user', async (test) => {
  const { client, facebook } = test.context;
  const response = await client.createTestUser();

  test.is(facebook.users.length, 1);
  test.deepEqual(response.data, facebook.users[0].publishView());
  test.deepEqual(facebook.users[0].options(), {});
});

test.serial('a user can be configured on creation', async (test) => {
  const { client, facebook } = test.context;

  const options = {
    installed: true,
    name: 'Jane Doe',
    owner_access_token: uuid(),
    permissions: [ 'email', 'public_profile' ],
    uid: uuid()
  };

  const response = await client.createTestUser(options);

  test.is(facebook.users.length, 1);
  test.deepEqual(response.data, facebook.users[0].publishView());
  test.deepEqual(facebook.users[0].options(), options);
});
