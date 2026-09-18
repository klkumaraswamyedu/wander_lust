const Listing = require("./model/listing");
const Review = require("./model/reviews");
const { listingschema, reviewschema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.params.id) {
      req.session.redirectURL = `/listing/${req.params.id}`;
    } else {
      req.session.redirectURL = req.originalUrl;
    }
    req.flash("error", "login before accessing");
    return res.redirect("/user/login");
  }
  next();
};

module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "your are not allowed to edit other list");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id } = req.params;
  let { reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (
    review &&
    res.locals.currUser &&
    !review.author.equals(res.locals.currUser._id) //use locals to access currUser because it is set in app.js and can be accessed anywhere in the app
  ) {
    req.flash("error", "your are not allowed to delete other review");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

//validate middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingschema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

//validate review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewschema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(error);
    return next(new ExpressError(400, errMsg));
  }
  next();
};
