const express = require("express");
const router = express.Router();
const doctorAuth = require("./middlewares/doctorAuth.js");
const userAuth = require("./middlewares/userAuth");

const {
    getPrescriptions,
    savePrescription
} = require('../controllers/PrescriptionController.js');



router.post('/prescriptions', userAuth, getPrescriptions);
router.post('/prescription', doctorAuth, savePrescription);

module.exports = router