const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const handleUserLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //set token in the Authorization header
    res.setHeader("Authorization", `Bearer ${token}`);

    // Respond with the user details in the response body
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username },
      accessToken : token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleUserLogin,
};
