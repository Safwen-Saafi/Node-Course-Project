const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();


router
  .post('/signup', authController.signup);

  router
  .get('/login', authController.login);

  
router.post('/forgotPassword', authController.forgotPassword);


router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), userController.deleteUser);

module.exports = router;
