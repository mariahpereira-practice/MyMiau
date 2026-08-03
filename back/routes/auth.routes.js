const express = require('express');
const { login, register } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/local', login);
router.post('/local/register', register);

module.exports = router;
