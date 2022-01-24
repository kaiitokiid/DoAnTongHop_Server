const express = require('express');
const router = express.Router();

const siteController = require('../controllers/SiteController');

// router.get('/search', siteController.search);

router.post('/', siteController.index);

module.exports = router;
