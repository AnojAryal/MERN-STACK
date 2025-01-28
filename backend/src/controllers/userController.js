const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// Create new user
const handleUserSignup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  handleUserSignup,
};
