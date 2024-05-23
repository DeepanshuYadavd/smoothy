// import:
const express=require("express");
const mongoose=require("mongoose");
const authRoutes=require("./routes/authRoutes");
const cookieParser=require("cookie-parser");
const { requireAuth,currentUser } = require("./middleware/authmiddleware");
const app=express();

//  set the view engine:
app.set("view engine","ejs");
// use public directory using express.static:
app.use(express.static("public"));
// middleware for taking body from frontend:
app.use(express.json());
// middleware for cookies:
app.use(cookieParser());

// connected database:
mongoose.connect("mongodb://localhost:27017/smoothies")
.then(()=>{
    console.log("database connected successfully");
})
.catch((error)=>{
    console.error(error._message);
})

// route to all page:
app.get("*",currentUser);
//  rendering homepage:
app.get("/",(req,res)=>{
    res.redirect("/home");
 })

app.get("/home",(req,res)=>{
    res.render("home",{title:"Home"})
})

// rendoring recipe page:
app.get("/recipe",requireAuth,(req,res)=>{
    res.render("smoothies",{title:"Recipe"})
})
// cookies:
// app.get("/set-cookies",(req,res)=>{
//     // without cookie-parser package:
//     // res.setHeader("set-cookie","newUser=true");

//     // with cookie-parser package:
// res.cookie("newUser",false);
// res.cookie("isEmployee",true,{maxAge:1000*60*60*24,httpOnly:false});
//     res.send("you got the cookies!!!");
// })
// app.get("/read-cookies",(req,res)=>{
//     const cookies=req.cookies;
//     console.log(cookies);
//     res.json(cookies);
// })


// auth routes:
app.use(authRoutes);

// local host connectivity:
app.listen(3000,"127.0.0.1",()=>{
    console.log("connected successfully");
})