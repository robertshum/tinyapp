const { assert } = require('chai');
const { findUserByEmail,
  urlsForUser,
  generateRandomString
} = require('../helpers.js');

describe('findUserByEmail', function() {

  //setup data
  const testUsers = {
    "userRandomID": {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      password: "dishwasher-funk"
    }
  };

  it('should return a user with valid email', function() {
    const user = findUserByEmail(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  });

  it('should return undefined with a random email', function() {
    const user = findUserByEmail(testUsers, "wowow@example.com");
    assert.strictEqual(user, undefined);
  });

  it('should return undefined with empty string', function() {
    const user = findUserByEmail(testUsers, "");
    assert.strictEqual(user, undefined);
  });
});

describe('urlsForUser', function() {

  //setup data
  const urlDatabase = {
    "b2xVn2": {
      longURL: "http://www.lighthouselabs.ca",
      userId: "user1RandomID"
    },
    "9sm5xK": {
      longURL: "http://www.google.com",
      userId: "user2RandomID"
    }
  };

  it('should return lhl url with user', function() {
    const urlObjs = urlsForUser(urlDatabase, "user1RandomID");
    const expectedURL = "http://www.lighthouselabs.ca";
    assert.strictEqual(urlObjs["b2xVn2"].longURL, expectedURL);
  });

  it('should return {} with invalid user', function() {
    const urlObjs = urlsForUser(urlDatabase, "joeybloey");
    assert.deepEqual(urlObjs, {});
  });
});

describe('generateRandomString', function() {
  it('should give me 6 char from random generatior', function() {
    const randomString = generateRandomString();
    console.log(randomString.length);
    assert.isTrue(randomString.length === 6);
  });
});
