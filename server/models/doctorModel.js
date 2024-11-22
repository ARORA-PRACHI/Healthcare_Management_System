const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
      unique: true, // Ensures no duplicate emails for doctors
    },
    speciality: {
      type: String,
      required: [true, "Please add your speciality"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please add your phone number"],
    },
    experience: {
      type: String,
      required: [true, "Please add your experience in years"],
    },
    address: {
      type: String,
      required: [true, "Please add your address"],
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
