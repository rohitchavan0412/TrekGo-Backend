const express = require('express')
const viewsController = require('./../controllers/viewsController')
const authController = require('./../controllers/authController')
const router = express.Router()


router.get('/', authController.isLoggedIn, viewsController.base)
router.get('/overview', authController.isLoggedIn, viewsController.getOverview)
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour)
router.get('/login', authController.isLoggedIn, viewsController.login)
router.get('/me', authController.protect, viewsController.getAccount)


router.post('/submit-user-data', authController.protect, viewsController.updateUser)
module.exports = router