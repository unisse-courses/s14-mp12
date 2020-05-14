const express = require('express');
const router = express.Router();

const controller = require('../setters/controller');

router.get('/new', controller.getSearchResult);

router.get('/popular', controller.getSearchResult)
router.get('/popular/5star', controller.getSearchResult)
router.get('/popular/4star', controller.getSearchResult)
router.get('/popular/3star', controller.getSearchResult)
router.get('/popular/2star', controller.getSearchResult)
router.get('/popular/1star', controller.getSearchResult)

module.exports = router;