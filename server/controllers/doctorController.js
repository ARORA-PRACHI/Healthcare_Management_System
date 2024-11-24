const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register Doctor
const registerDoctor = asyncHandler(async (req, res) => {
  const { name, email, speciality, phoneNumber, experience, address, password } = req.body;

  if (!name || !email || !speciality || !phoneNumber || !experience || !address || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Check if the doctor already exists
  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) {
    return res.status(400).json({ message: "Doctor already exists" });
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new doctor
  const doctor = new Doctor({
    name,
    email,
    speciality,
    phoneNumber,
    experience,
    address,
    password: hashedPassword, 
  });

  // Save the new doctor
  const createdDoctor = await doctor.save();

  if (createdDoctor) {
    res.status(201).json({
      message: "Doctor registered successfully",
      doctor: {
        id: createdDoctor._id,
        name: createdDoctor.name,
        email: createdDoctor.email,
        speciality: createdDoctor.speciality,
        phoneNumber: createdDoctor.phoneNumber,
        experience: createdDoctor.experience,
        address: createdDoctor.address,
      },
    });
  } else {
    res.status(500); 
    throw new Error("Failed to register doctor");
  }
});

// Login Doctor
const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  // Find doctor by email
  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare the provided password with the stored hashed password
  const passwordMatch = await bcrypt.compare(password, doctor.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: doctor._id, name: doctor.name, email: doctor.email }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: "1h" } // Token expiration time
  );

  // Send response with doctor data and token
  res.status(200).json({
    message: "Login successful",
    doctor: {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      speciality: doctor.speciality,
      phoneNumber: doctor.phoneNumber,
      experience: doctor.experience,
      address: doctor.address,
    },
    token, 
  });
});

module.exports = {
  registerDoctor,
  loginDoctor,
};
