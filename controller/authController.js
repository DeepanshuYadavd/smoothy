// model or collection name:
const users = require("../models/users");
// import jwt package:
const jwt = require("jsonwebtoken");

// handleError:
const handleError = (err) => {
  const errors = { email: " ", password: " " };
  // duplicate error:
  if (err.code === 11000) {
    errors.email = "email is already exist";
  }
  // validation error:
  if (err.message.includes("users validation failed")) {
    // Object.values(err.errors) this will retrn the list of validation error
    //  jo err hai usme ik errors object hai,basically humne uski value li hai:
    Object.values(err.errors).forEach((error) => {
      errors[error.properties.path] = error.properties.message;
    });
  }

  return errors;
};

// handle error of login:
const handleError2 = (err) => {
  const errors = { email: " ", password: " " };
  if (err.message.includes("incorrect email")) {
    errors["email"] = err.message;
  } else {
    errors["password"] = err.message;
  }
  return errors;
};

// create a jwt token:
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "deepanshu's secret", {
    expiresIn: maxAge,
  });
};

// exports handlers or functions
// 1.signup get request handler:
module.exports.get_signup = (req, res) => {
  res.render("signup", { title: "signup" });
};
// 2.login get request handler:
module.exports.get_login = (req, res) => {
  res.render("login", { title: "login" });
};
// 2.signup post request handler:
module.exports.post_signup = async (req, res) => {
  const body = req.body;
  try {
    const user = await users.create(body);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
    });
    res.status(201).json(user);
  } catch (err) {
    const error = handleError(err);
    res.status(404).json(error);
  }
};
// 2.login post request handler:
module.exports.post_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await users.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
    });
    res.status(201).json(user);
  } catch (err) {
    const error = handleError2(err);
    res.status(404).json(error);
  }
};

// log out function:
module.exports.get_logout=(req,res)=>{
  res.cookie("jwt","",{maxAge:1});
  res.redirect("/");
}
