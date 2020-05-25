const express = require('express')
const error = require('../controllers/error.controller')
const ROUTER = express.Router()

ROUTER.get('/offline', error.offline)

module.exports = ROUTER
