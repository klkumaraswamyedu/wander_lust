const Listing = require("../model/listing");
const Review = require("../model/reviews");

//create review
module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(req.params.id);
  let review = req.body.review;
  review.author = res.locals.currUser._id;
  let newReview = new Review(review);
  list.reviews.push(newReview);
  await newReview.save();
  await list.save();
  res.redirect(`/listing/${id}`);
};

//delete review
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  return res.redirect(`/listing/${id}`);
};
