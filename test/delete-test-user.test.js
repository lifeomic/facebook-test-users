const test = require('ava');
const testUsers = require('..');

const { useFacebookMock } = require('./helpers/facebook');

useFacebookMock(test);

test.beforeEach(async (test) => {
  const { appId, appSecret } = test.context.facebook;
  test.context.client = await testUsers.createClient({ appId, appSecret });
});

test.serial('deleting a test user destroys the user record', async (test) => {
  const { client, facebook } = test.context;
  const user = facebook.users.createUser();
  await client.deleteTestUser(user);
  test.is(facebook.users.length, 0);
});
