const joi = require("joi");

module.exports = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string(),
      country: joi.string().required(),
      price: joi.number().min(0).required(),
      image: joi.object({
        url: joi.string().allow(null, ""),
        filename: joi.string().allow(null, ""),
      }),
    })
    .required(),
});
