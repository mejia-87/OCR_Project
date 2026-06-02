const express = require('express');

const { createLetter} = require('../controllers/letter.controller');

const router = express.Router();

router.post('/create', createLetter);

module.exports = router;