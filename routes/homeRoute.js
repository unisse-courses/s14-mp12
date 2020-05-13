const express = require('express');
const router = express.Router();

const controller = require('../setters/controller');

router.get('/new', controller.homepage);

router.get('/popular', controller.homepage);
router.get('/popular/5star', controller.homepage);
router.get('/popular/4star', controller.homepage);
router.get('/popular/3star', controller.homepage);
router.get('/popular/2star', controller.homepage);
router.get('/popular/1star', controller.homepage);

module.exports = router;