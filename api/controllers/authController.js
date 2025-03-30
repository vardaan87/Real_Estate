import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'
import jwt  from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
export const signup=async(req,res,next)=>{
    const {username,email,name,password,phone}=req.body;
    const hashPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({ username, email,name, password:hashPassword,phone});
    try{
        await newUser.save();
        res.status(201).json({
         message:"user created successfully"
        })
    }
    catch(e){
     next(e);
    }
  
}
const options = {
  expires: new Date(Date.now()+90*24*60*60*1000),
  httpOnly: true,
  secure:true,
  sameSite:"none"
}

export const signin = async (req, res, next) => {
 
 
    const { username, password } = req.body;
    try {
      const validUser = await User.findOne({ username });
      if (!validUser) return next(errorHandler(404, 'User not found!'));
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(401, 'Wrong password!!'));
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = validUser._doc;
      res
        .cookie('access_token', token, options)
        .status(200)
        .json(rest);
    } catch (error) {
      
      next(error);
    }
  };



  export const google = async (req, res, next) => {
   
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;
        res
          .cookie('access_token', token, options)
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        console.log(req.body);
        const newUser = new User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          phone:  req.body.phone || "111",
          name : req.body.name,
    
          avatar: req.body.photo,
        });
        await newUser.save();
        console.log("saved")
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        console.log("tokend")
        const { password: pass, ...rest } = newUser._doc;
        console.log("extraact")
        res
          .cookie('access_token', token, options)
          .status(200)
          .json(rest);
      }
    } catch (error) {
      console.log(error)
      next(error);
    }
  };
  

  export const signOut=async(req,res,next)=>{
    try{
    res.clearCookie( "access_token" );

    res.status(200).json("Logged out successfully")
    }catch(err){
     next(err);
    }
  }