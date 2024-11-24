const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection.js");

// Import the routers
const userRouter = require("./routers/userRouter");
const doctorRouter = require("./routers/doctorRouter");

connectDb();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Working");
});

// Routes for users
app.use('/api/users', userRouter);

// Routes for doctors
app.use('/api/doctors', doctorRouter);  // Make sure doctorRouter is correctly mapped

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
