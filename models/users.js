const mongoose=require("mongoose");
// import isEmail object fromm validator
const {isEmail}=require("validator");
// import bcrypt package:
const bcrypt= require("bcrypt");
// schema:
 const userSchema=new mongoose.Schema({
      email:{
        type:String,
        required:[true,"please enter an email"],
        unique:true,
        lowercase:true,
        validate:[isEmail,"please enter valid email"]
      },
      password:{
        type:String,
        required:[true,"please enter an password"],
        minlength:[6,"minmum length should be six"],
      },
 });

//  hashing the password before saving the data in db:
// install bcrypt package and import it
userSchema.pre("save",async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

// finding the useremail and compare the password:
userSchema.statics.login= async function(email,password){
    
    const user=await this.findOne({email});
    if(user){
        const auth=await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error("incorrect password")
    }
    throw Error("incorrect email")
}

//  model:
const users=mongoose.model("users",userSchema);

module.exports = users;