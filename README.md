facebook-test-users
===================

> Utilities for working with Facebook test users, this package uses v10.0 of the Facebook graph-api. [link](https://developers.facebook.com/docs/graph-api/changelog/version10.0#graph-api)

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
[description of the matching user][user-fields] augmented with the matched
fields or `null` if no users matched the specified fields.

 - **fields** — An object describing the fields that the test user must match.
   Only fields from the [user node][user-node] can be matched.

### `async client.getTestUser({ id, includeFields })`

Fetches the [user node][user-node] for the user with the specified ID.
Returns the [user node][user-node] with the specified fields.

 - **id** — the ID of the user to retrieve
 - **includeFields** _optional_ An array specifying the fields to include. Only
   fields from the [user node][user-node] may be specified.

References:
 - [Lookup a Test User][user-node]

## `async client.listTestUsers({ includeFields })`

Get a list of all test users associated with the app. Returns a list of
[user descriptions][user-fields] augmented with any additional requested
fields.

- **includeFields** _optional_ An array specifying the fields to include. Only
  fields from the [user node][user-node] may be specified.

References:
 - [Test Users][test-users]

[delete-test-user]: https://developers.facebook.com/docs/graph-api/reference/v10.0/application/accounts#Deleting "Delete a Test User"
[publish-fields]: https://developers.facebook.com/docs/graph-api/reference/v10.0/application/accounts#parameters-2 "Test User Publish Fields"
[publish-response]: https://developers.facebook.com/docs/graph-api/reference/v10.0/application/accounts#return-type "Publish User Response"
[publish-user]: https://developers.facebook.com/docs/graph-api/reference/v10.0/application/accounts#Creating "Create a Test User"
[user-fields]: https://developers.facebook.com/docs/graph-api/reference/v10.0/user#fields "User Fields"
[user-node]: https://developers.facebook.com/docs/graph-api/reference/v10.0/user#read "User Node"
[test-users]: https://developers.facebook.com/docs/graph-api/reference/v10.0/application/accounts#Reading "Test Users"
