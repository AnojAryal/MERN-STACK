const User = require("../models/userModel");
const mongoose = require("mongoose");

//create new user
const handleUserSignup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({ username, email, password });
        res.status(201).json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

module.exports = {
    handleUserSignup,
}