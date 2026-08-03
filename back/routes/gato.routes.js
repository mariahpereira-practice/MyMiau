const express = require('express');
const { getGatos } = require('../controllers/gatos.controller');

const router = express.Router();

router.get('/', getGatos);

module.exports = router;
