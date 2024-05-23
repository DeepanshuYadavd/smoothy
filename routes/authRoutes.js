const express=require("express");
const authcontroller=require("../controller/authController")
const router=express.Router();

// routes of autherization:
router.get("/signup",authcontroller.get_signup)
router.post("/signup",authcontroller.post_signup)
router.get("/login",authcontroller.get_login)
router.post("/login",authcontroller.post_login)
router.get("/logout",authcontroller.get_logout)
module.exports=router;