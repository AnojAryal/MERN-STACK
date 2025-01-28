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

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Save refresh token to user
    user.refreshToken = refreshToken;

    //set token in the Authorization header
    res.setHeader("Authorization", `Bearer ${token}`);

    // Respond with the user details in the response body
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username },
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//generate refresh token
const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  const user = await User.findOne({ refreshToken });

  if (!user) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // If the refresh token is valid, create a new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  });
};

module.exports = {
  handleUserLogin,
  handleRefreshToken,
};
