const express = require("express");
const router = express.Router();
const doctorAuth = require("./middlewares/doctorAuth.js");
const userAuth = require("./middlewares/userAuth.js");

const {
    getPatients,
    getPatientById,
    savePatient,
    updatePatient,
    deletePatient,
    getPatientHistory
} = require('../controllers/PatientController.js')



router.get('/patients', userAuth, getPatients);
router.get('/patients/:id', userAuth, getPatientById);
router.post('/patients', userAuth, savePatient);
router.patch('/patients/:id', userAuth, updatePatient);
router.delete('/patients/:id', userAuth, deletePatient);
router.get('/patients/history/:id', doctorAuth,getPatientHistory);


module.exports = router