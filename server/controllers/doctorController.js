const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");
require("dotenv").config();

// Register Doctor
const registerDoctor = asyncHandler(async (req, res) => {
  const { name, email, speciality, phoneNumber, experience, address, password } = req.body;

  // Check for missing fields
  if (!name || !email || !speciality || !phoneNumber || !experience || !address || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Check if the doctor already exists
  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) {
    return res.status(400).json({ message: "Doctor already exists" });
  }

  // Create a new doctor
  const doctor = new Doctor({
    name,
    email,
    speciality,
    phoneNumber,
    experience,
    address,
    password 
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
    res.status(500); // Internal server error
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

  const doctor = await Doctor.findOne({ email });

  if (!doctor) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (doctor.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

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
  });
});

module.exports = {
  registerDoctor,
  loginDoctor,
};
