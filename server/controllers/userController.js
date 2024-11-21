const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
require("dotenv").config();

const registerUser = asynchandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password || !phoneNumber) {
    res.status(400); // Bad request
    throw new Error("Please fill in all fields");
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create a new user
  const user = new User({
    name,
    email,
    password,
    phoneNumber,
  });

  // Save the new user
  const createdUser = await user.save();

  if (createdUser) {
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        phoneNumber: createdUser.phoneNumber,
      },
    });
  } else {
    res.status(500); // Internal server error
    throw new Error("Failed to register user");
  }
});


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

  

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
};
