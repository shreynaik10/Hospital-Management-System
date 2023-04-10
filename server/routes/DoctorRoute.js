const express = require("express");
const router = express.Router();

const {
    getDoctors,
    getDoctorById,
    saveDoctor,
    updateDoctor,
    deleteDoctor
} = require('../controllers/DoctorController.js')



router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);
router.post('/doctors', saveDoctor);
router.patch('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

module.exports = router