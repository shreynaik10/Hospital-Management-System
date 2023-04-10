const express = require("express");
const router = express.Router();
const userAuth = require('./middlewares/userAuth');
const doctorAuth = require('./middlewares/doctorAuth');


const {
    getUserCountByRole,
    getAppointmentCount,
    getPatientsTreatedCount
} = require('../controllers/AdminDashController.js')



router.post('/count/users', userAuth, getUserCountByRole);
router.get('/count/appointments', userAuth, getAppointmentCount);
router.get('/count/patients/treated', doctorAuth, getPatientsTreatedCount)


module.exports = router