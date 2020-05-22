const express = require('express')
const base = require('../controllers/default.controller')
const ROUTER = express.Router()
var multer  = require('multer')
var upload = multer()

ROUTER.get('/', base.home)
ROUTER.post('/upload-snapshot', upload.single('file'), base.snapshot)

module.exports = ROUTER
