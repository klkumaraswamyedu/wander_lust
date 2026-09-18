const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportMongooseLocal = require("passport-local-mongoose");

userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportMongooseLocal.default);

module.exports = mongoose.model("User", userSchema); //(model-Naem , shema-name)
