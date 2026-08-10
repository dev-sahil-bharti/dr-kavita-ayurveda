const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const auth = require('../middleware/auth');

router.use(auth); // Protect setting routes

router
  .route('/')
  .get(getSettings)
  .put(updateSettings);

module.exports = router;
