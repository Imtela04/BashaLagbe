require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for authenticated user
 * @param {Object} user - User object containing user details
 * @returns {String} JWT token
 */
const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
      isAdmin: user.isAdmin,
      userType: user.userType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
};

/**
 * Middleware to verify JWT token from request headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(401).send({
      message: "Authorization header is required",
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  signInToken,
  isAuth,
};