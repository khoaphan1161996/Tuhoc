const express = require('express')
const router = express.Router()

const controller = require('../controllers/user.controller')
const validate = require('../validate/users.validate')

router.get('/', controller.index)

router.get('/search', controller.search)

router.get('/create', controller.create)

router.get('/:id', controller.get)

router.post('/create',validate.postCreate, controller.postCreate)

module.exports = router