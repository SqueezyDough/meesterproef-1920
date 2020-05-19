const express = require('express')
const base = require('../controllers/default.controller')
const ROUTER = express.Router()

ROUTER.get('/', base.home)

module.exports = ROUTER