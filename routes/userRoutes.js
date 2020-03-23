const express = require('express');
// getting the user control function for API request from userController
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.get('/me', authController.protect, userController.getMe)

router.patch('/updateMe', authController.protect, userController.updateMe);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

// All route from this onward are protected and used by only admin
//router.use(authController.restrictTo('admin'))

router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)

router
  .route('/:id')
  .get(authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  )
  .patch(authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = router;
