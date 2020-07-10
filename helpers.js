// email lookup function
const checkEmailDupe = (emailInput, userDb) => {
  for (let user in userDb) {
    if (emailInput === userDb[user].email) {
      return true;
    }
  }
  return false;
};

module.exports = checkEmailDupe;
