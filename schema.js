const joi = require("joi");

const listingschema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string(),
      country: joi.string().required(),
      price: joi.number().min(0).required(),
      image: joi
        .object({
          url: joi.string().allow(null, ""),
          filename: joi.string().allow(null, ""),
        })
        .required(),
    })
    .required(),
});

const reviewschema = joi.object({
  review: joi
    .object({
      comment: joi.string().required(),
      rating: joi.number().max(5).min(1).required(),
    })
    .required(),
});

module.exports = { listingschema, reviewschema };
