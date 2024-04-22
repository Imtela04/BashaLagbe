require("dotenv").config();
const jwt = require("jsonwebtoken");   ///token for secure communication

const signInToken = (user) => {   //takes user object as argument and sign method e jay and payload niye user object pass hoy function e
  return jwt.sign(
    {                                                           ///authentication purpose e used 
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,   /// holds secret key  jeta used for signing 
    {
      expiresIn: "2d", //2 days expiry of token
    }
  );
};

// const tokenForVerify = (user) => {
//   return jwt.sign(
//     {                                        //verifying if it's already in the database
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       password: user.password,
//     },
//     process.env.JWT_SECRET_FOR_VERIFY,
//     { expiresIn: "15m" }   // 15 mins e expired
//   );
// };

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log('authorization',authorization)
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);     //gibb theke readable
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

module.exports = {
  signInToken,
  // tokenForVerify,
  isAuth,
};
