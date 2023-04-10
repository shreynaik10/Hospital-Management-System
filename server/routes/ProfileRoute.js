const express = require("express");
const router = express.Router();

const  { 
    getAdminByUserId,
    updateAdmin,
    getPatientByUserId,
    updatePatient,
    getDoctorByUserId,
    updateDoctor,
} = require('../controllers/ProfileController.js')
 
 
router.get('/profile/admin/:id', getAdminByUserId);
router.patch('/profile/admin/:id', updateAdmin);

router.get('/profile/patient/:id', getPatientByUserId);
router.patch('/profile/patient/:id', updatePatient);

router.get('/profile/doctor/:id', getDoctorByUserId);
router.patch('/profile/doctor/:id', updateDoctor);


module.exports = router