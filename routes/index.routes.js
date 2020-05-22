const express = require('express')
const base = require('../controllers/default.controller')
const overview = require('../controllers/overview.controller')
const ROUTER = express.Router()
var multer  = require('multer')
var upload = multer()

ROUTER.get('/', base.home)
ROUTER.get('/scan-medicine', base.scanner)
ROUTER.get('/overview', overview.index)
ROUTER.post('/upload-snapshot', upload.single('file'), base.snapshot)

module.exports = ROUTER
