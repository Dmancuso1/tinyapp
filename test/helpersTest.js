const { assert } = require('chai');


const checkEmailDupe = require('../helpers.js');

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

describe('checkEmailDupe', function() {
  it('should return true if only one email is in the list', function() {
    const user = checkEmailDupe("user@example.com", testUsers);
    const expectedOutput = true;
    assert.equal(user, expectedOutput);
  });
  it('should return false if email not in database', function() {
    const user = checkEmailDupe("not-in-db@example.com", testUsers);
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});