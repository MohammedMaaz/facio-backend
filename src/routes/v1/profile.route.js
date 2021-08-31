const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const profileValidation = require('../../validations/profile.validation');
const profileController = require('../../controllers/profile.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), profileController.getProfile)
  .patch(auth(), validate(profileValidation.updateProfile), profileController.updateProfile);

module.exports = router;
