const express = require('express');
const authController = require('./../controllers/authController');
const {
  getAllReviews,
  createReview,
} = require('../controllers/reviewController');

const router = express.Router();
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('user'),
    getAllReviews
  )
  .post(createReview);



  module.exports = router;
