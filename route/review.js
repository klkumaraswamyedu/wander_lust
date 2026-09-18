const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js"); //double dots is to move to parent directory
const { validateReview } = require("../middleware.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js");

//review
//create route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

//delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview),
);

module.exports = router;
