const express = require("express");
const router = express.Router();
const {
  loginCustomer,
  registerCustomer,
  changePassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addAllCustomers,
} = require("../controller/customerController");

//register a user
router.post("/register", registerCustomer);

//login a user
router.post("/login", loginCustomer);

//change password
router.post("/change-password", changePassword);

//add all users
router.post("/add/all", addAllCustomers);

//get all user
router.get("/", getAllCustomers);

//get a user
router.get("/:id", getCustomerById);

//update a user
router.put("/:id", updateCustomer);

//delete a user
router.delete("/:id", deleteCustomer);

module.exports = router;
