const express = require('express');
const { registerDoctor, loginDoctor, getDoctorDetails, updateDoctorProfile } = require('../controllers/doctorController');
//const authenticateToken = require('../middlewares/jwtMiddleware'); // Ensure this import is correct
const router = express.Router();

// Route for registering a doctor
router.post('/register', registerDoctor);

// Other routes that require authentication
router.post('/login', loginDoctor);
//router.get('/details', authenticateToken, getDoctorDetails); 

module.exports = router;


// router.get('/details', authenticateToken, checkRole('doctor'), getDoctorDetails); // Use both authenticateToken and checkRole
// router.put('/update', authenticateToken, checkRole('doctor'), updateDoctorProfile);


