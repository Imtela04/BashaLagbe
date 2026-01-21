require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const { signInToken, tokenForVerify } = require("../config/auth");

const registerCustomer = async (req, res) => {
  const { name, email, password, userType } = req.body;
  const isAdded = await Customer.findOne({ email: email });

  if (isAdded) {
    const token = signInToken(isAdded);
    return res.send({
      token,
      _id: isAdded._id,
      name: isAdded.name,
      email: isAdded.email,
      userType: isAdded.userType,
      message: "Email Already Verified!",
    });
  } else {
    const newUser = new Customer({
      name,
      email,
      password: bcrypt.hashSync(password),
      userType: userType || 'tenant', // Default to tenant if not specified
    });
    await newUser.save();
    const token = signInToken(newUser);
    res.send({
      token,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      userType: newUser.userType,
      message: "Email Verified, Please Login Now!",
    });
  }
};

const addAllCustomers = async (req, res) => {
  try {
    await Customer.deleteMany();
    await Customer.insertMany(req.body);
    res.send({
      message: "Added all users successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.registerEmail });
    // console.log("customer:", req.body.registerEmail);

    if (
      customer &&
      customer.password &&
      bcrypt.compareSync(req.body.password, customer.password)
    ) {
      const token = signInToken(customer);
      res.send({
        token,
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
        image: customer.image,
        isAdmin: customer.isAdmin,
        userType: customer.userType,
        bio: customer.bio,
        profileVisibility: customer.profileVisibility,
      });
    } else {
      res.status(401).send({
        message: "Invalid user or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer.password) {
      return res.send({
        message:
          "For change password,You need to sign in with email & password!",
      });
    } else if (
      customer &&
      bcrypt.compareSync(req.body.currentPassword, customer.password)
    ) {
      customer.password = bcrypt.hashSync(req.body.newPassword);
      await customer.save();
      res.send({
        message: "Your password change successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email or current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const users = await Customer.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      customer.name = req.body.name || customer.name;
      customer.email = req.body.email || customer.email;
      customer.address = req.body.address || customer.address;
      customer.phone = req.body.phone || customer.phone;
      customer.image = req.body.image || customer.image;
      customer.bio = req.body.bio || customer.bio;
      customer.profileVisibility = req.body.profileVisibility || customer.profileVisibility;
      customer.userType = req.body.userType || customer.userType;
      
      const updatedUser = await customer.save();
      const token = signInToken(updatedUser);
      res.send({
        token,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        image: updatedUser.image,
        userType: updatedUser.userType,
        bio: updatedUser.bio,
        profileVisibility: updatedUser.profileVisibility,
      });
    }
  } catch (err) {
    res.status(404).send({
      message: "Your email is not valid!",
    });
  }
};

const deleteCustomer = (req, res) => {
  Customer.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "User Deleted Successfully!",
      });
    }
  });
};

const getCustomerByEmail = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email }).select('-password');
    if (customer) {
      res.send(customer);
    } else {
      res.status(404).send({
        message: "Customer not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  loginCustomer,
  registerCustomer,
  addAllCustomers,
  changePassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerByEmail,
};
