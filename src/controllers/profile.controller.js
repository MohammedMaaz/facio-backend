const { userService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getProfile = catchAsync(async (req, res) => {
  res.send(req.user);
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  res.send(user);
});

module.exports = {
  getProfile,
  updateProfile,
};
