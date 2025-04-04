const express = require('express');
const multer = require('multer');
const { gptVisionHandler } = require('../controllers/gptController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), gptVisionHandler);

module.exports = router;