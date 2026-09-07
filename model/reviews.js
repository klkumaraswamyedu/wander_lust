const { string, date, required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    max: 5,
    min: 1,
    required: true,
  },
  created_at: {
    type: Date,
    dafault: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
