const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.get('/:userId', userController.getUserById);

module.exports = router;
