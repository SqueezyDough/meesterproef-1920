const express = require('express')
const base = require('../controllers/default.controller')
const algolia = require('../controllers/algolia.controller')
const overview = require('../controllers/overview.controller')
const ROUTER = express.Router()

ROUTER.get('/', base.home)
ROUTER.get('/scan-medicine', base.scanner)
ROUTER.post('/scan-medicine', base.scannerPost)
ROUTER.post('/tesseract-search', algolia.tesseractSearch)
ROUTER.post('/overview-search', algolia.overviewSearch, overview.index)
ROUTER.get('/overview', overview.index)

module.exports = ROUTER
