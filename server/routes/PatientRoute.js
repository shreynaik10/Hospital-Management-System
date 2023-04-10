const express = require("express");
const router = express.Router();
const doctorAuth = require("./middlewares/doctorAuth.js");

const {
    getPatients,
    getPatientById,
    savePatient,
    updatePatient,
    deletePatient,
    getPatientHistory
} = require('../controllers/PatientController.js')



router.get('/patients', getPatients);
router.get('/patients/:id', getPatientById);
router.post('/patients', savePatient);
router.patch('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);
router.get('/patients/history/:id', doctorAuth,getPatientHistory);


module.exports = router