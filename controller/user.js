const User = require("../model/user");

module.exports.signupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.createUser = async (req, res, next) => {
  try {
    let { email, username, password } = req.body;
    let newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);

    req.login(registerUser, (err) => {
      if (err) {
        return next(err); //usign login funtion as similar to logout
      }
      req.flash("success", "login succcessful");
      let redirectUrl = res.locals.redirectURL || "/listing";
      res.redirect(redirectUrl);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/user");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "welcome to wanderlust");
  let redirectURL = res.locals.redirectURL || "/listing";
  res.redirect(redirectURL);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    // logout takes cb as parameter
    if (err) {
      return next(err); //if any err occur happend then passed it to error handling middleware
    }
    req.flash("success", "succesfully log out");
    res.redirect("/listing"); //this flash is show in listing page only
  });
};
