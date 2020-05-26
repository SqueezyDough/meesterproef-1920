const express = require('express')
const base = require('../controllers/default.controller')
const overview = require('../controllers/overview.controller')
const ROUTER = express.Router()

ROUTER.get('/', base.home)
ROUTER.get('/scan-medicine', base.scanner)
ROUTER.get('/overview', overview.index)

module.exports = ROUTER
