const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utills/error");
const jwt = require("jsonwebtoken");


/*
const generateSupabaseJWT = (userId) => {
  const payload = {
    role: 'authenticated', // Required by Supabase
    sub: userId, // Subject (user ID)
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
  };

  // Sign the JWT with Supabase's service_role key
  const token = jwt.sign(payload, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return token;
};
*/

const signUp = async (req, res, next) => {
  console.log(req.body);
  try {
    const { userName, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 12);

    let newUser = await userModel.create({
      userName: userName,
      email: email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ user: newUser, message: "user created Successfully" });
  } catch (e) {
    next(e);
    //here we can use our custom errorHandler function which is in the error.js file
    //next(errorHandler(550, "error from the function"));
  }
};

const signIn = async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const validUser = await userModel.findOne({ email: email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "Invalid password"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token)
      .status(200)
      .json(rest);
  } catch (e) {
    next(e);
  }
};

const signInWithGoogle = async (req, res, next) => {

  console.log(req.body);
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      console.log("enter in user found block");
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 12);
      const newUser = await userModel.create({
        userName:
          req.body.userName.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-3),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      console.log("new user is :  ")
      console.log(JSON.stringify(newUser));

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (e) {
    next(e);
  }
};


const signOut= (req, res, next)=>{

  try{
      res.clearCookie('access_token');
      res.status(200).json({message : 'User is Sign Out Successfully'});

  }catch(e){
      next(e);
  }
}

module.exports = { signUp, signIn, signInWithGoogle, signOut };



