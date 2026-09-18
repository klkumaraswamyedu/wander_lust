require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 8080;
//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.MONGO_URL;
const methodOverride = require("method-override");
const engine = require("ejs-mate");
// session packages
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./model/user.js");

const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/review.js");
const userRouter = require("./route/user.js");

const passport = require("passport");
const LocalStatergy = require("passport-local");
const passportMongooseLocal = require("passport-local-mongoose");

const isLoggedIn = require("./middleware.js");
const isOwner = require("./middleware.js");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);

main()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECREAT,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log(`ERROR on mongodb session store , ${err}`);
});

const sessionOption = {
  store,
  secret: process.env.SECREAT,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize()); //passport got initaialize to every request
app.use(passport.session()); // to store and identify the same user on single session
passport.use(new LocalStatergy(User.authenticate()));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //this is middleware user to store all wanted content within the session
  next();
});

//all listing route
app.use("/listing", listingRouter); //listing is router here

//all review roure
app.use("/listing/:id/review", reviewRouter);

app.use("/user", userRouter);

// Page Not Found Catch-all
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Centralized Error Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listing/error.ejs", { err, message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
