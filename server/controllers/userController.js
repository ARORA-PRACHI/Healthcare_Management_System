const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const registerUser = asynchandler(async (req, res) => {
  const { firstName, lastName, userName, email, password, phone } = req.body;

  if (!firstName || !lastName || !userName || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    name: `${firstName} ${lastName}`,
    userName,
    email,
    password: hashedPassword,
    phoneNumber: phone,
  });

  // Save the new user
  const createdUser = await user.save();

  if (createdUser) {
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: createdUser._id,
        name: createdUser.name,
        userName: createdUser.userName,
        email: createdUser.email,
        phoneNumber: createdUser.phoneNumber,
      },
    });
  } else {
    res.status(500); 
    throw new Error("Failed to register user");
  }
});




// Login User
const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in the details correctly");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare the provided password with the stored hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email }, // Payload (can include user data you need)
    process.env.JWT_SECRET, // Secret key for signing the token
    { expiresIn: '1h' } // Token expiration time (1 hour in this example)
  );

  // Send response with user data and token
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    token, 
  });
});

module.exports = {
  registerUser,
  loginUser,
};

