const { updateUser } = require('./user.validation');

const updateProfile = {
  body: updateUser.body,
};

module.exports = {
  updateProfile,
};
