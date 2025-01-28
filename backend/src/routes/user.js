const express = require("express");
const {
  handleUserSignup,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

//signup
router.post("/", handleUserSignup);

//get all users
router.get("/", getUsers);

//delete user
router.delete("/:id", deleteUser);

module.exports = router;
