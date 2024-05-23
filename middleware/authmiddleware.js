const jwt = require("jsonwebtoken");
// model or collection name:
const users = require("../models/users");
// required authentication funtion :
// ye function call kiya jayega app.js mai jha pr route hai "/recipe"
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    //    iss token ko verify krna hai:
    jwt.verify(token, "deepanshu's secret", (err, decodeToken) => {
      if (err) {
        // console.log(err.message)
        res.redirect("/login");
      } else {
        // console.log("hello",decodeToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// ye function call kiya jayga app.js mai jab request ayegi universal path par
// matlab ki har ik route pr req ayegi
const currentUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    //    iss token ko verify krna hai:
    jwt.verify(token, "deepanshu's secret", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        // decodedToken ke ander payload tha i.e. id
        // iss id ka use krke hum user ko find krenge and usse ejs file mai send krenge
        const user= await users.findById(decodedToken.id);
        //    ejs file mai hum user(variable) ka use krke user ko le skte hai
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, currentUser };
