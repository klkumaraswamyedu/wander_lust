const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../model/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware");
const userController = require("../controller/user");

router
  .route("/signup")
  .get(userController.signupForm)
  .post(saveRedirectURL, wrapAsync(userController.createUser));

router
  .route("/login")
  .post(
    saveRedirectURL,
    passport.authenticate("local", {
      failureRedirect: "/user/login",
      failureFlash: true,
    }),
    userController.loginUser,
  )
  .get(userController.loginForm);

router.get("/logout", userController.logoutUser);

module.exports = router;
