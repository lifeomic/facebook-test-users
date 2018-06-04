facebook-test-users
===================

> Utilities for working with Facebook test users

[![Build Status](https://travis-ci.org/lifeomic/facebook-test-users.svg?branch=master)](https://travis-ci.org/lifeomic/facebook-test-users)
[![Coverage Status](https://coveralls.io/repos/github/lifeomic/facebook-test-users/badge.svg?branch=master)](https://coveralls.io/github/lifeomic/facebook-test-users?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/lifeomic/facebook-test-users.svg)](https://greenkeeper.io/)

## Usage

Install the package as a dependency.

```
$ npm install --save @lifeomic/facebook-test-users
```

Create a client instance.

```
const testUsers = require('@lifeomic/facebook-test-users');
. . .
const client = await testUsers.createClient({ appId, appSecret });
```

### `async testUsers.createClient({ appId, appSecret })`

Create a new client instance.

 - **appId** — the Facebook application's client ID
 - **appSecret** - the Facebook application's client secret

### `async client.createTestUser(options)`

Create a new test user. Returns [a description of the user][publish-response].

 - **options** — _optional_ an object specifying the [fields][publish-fields] to
  apply when publishing the user

References:
 - [Create a Test User][publish-user]

### `async client.deleteTestUser({ id })`

Delete a test user.

 - **id** — the uid of the user to delete

References:
  - [Delete a Test User][delete-test-user]

### `async client.findTestUser(fields)`

Find a test user that matches the specified fields. Returns a
[description of the matching user][test-user-fields] augmented with the matched
fields or `null` if no users matched the specified fields.

 - **fields** — An object describing the fields that the test user must match.
   Only fields from the [test user node][test-user-node] can be matched.

### `async client.getTestUser({ id, includeFields })`

Fetches the [test user node][test-user-node] for the user with the specified ID.
Returns the [test user node][test-user-node] with the specified fields.

 - **id** — the ID of the user to retrieve
 - **includeFields** _optional_ An array specifying the fields to include. Only
   fields from the [test user node][test-user-node] may be specified.

References:
 - [Lookup a Test User][test-user-node]

## `async client.listTestUsers({ includeFields })`

Get a list of all test users associated with the app. Returns a list of
[user descriptions][test-user-fields] augmented with any additional requested
fields.

- **includeFields** _optional_ An array specifying the fields to include. Only
  fields from the [test user node][test-user-node] may be specified.

References:
 - [Test Users][test-users]

[delete-test-user]: https://developers.facebook.com/docs/graph-api/reference/v3.0/test-user#deleting "Delete a Test User"
[publish-fields]: https://developers.facebook.com/docs/graph-api/reference/v3.0/app/accounts/test-users#pubfields "Test User Publish Fields"
[publish-response]: https://developers.facebook.com/docs/graph-api/reference/v3.0/app/accounts/test-users#pubresponse "Publish User Response"
[publish-user]: https://developers.facebook.com/docs/graph-api/reference/v3.0/app/accounts/test-users#publish "Create a Test User"
[test-user-fields]: https://developers.facebook.com/docs/graph-api/reference/v3.0/app/accounts/test-users#readfields " Test User Fields"
[test-user-node]: https://developers.facebook.com/docs/graph-api/reference/v3.0/test-user#read "Test User Node"
[test-users]: https://developers.facebook.com/docs/graph-api/reference/v3.0/app/accounts/test-users "Test Users"
