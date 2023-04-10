const express = require("express");
const router = express.Router();
const adminAuth = require('./middlewares/adminAuth');


const {
    getDepartments,
    getAppointments,
    getAppointmentById,
    createAppointmentSlot,
    bookAppointment,
    deleteAppointment,
    updateAppointmentById
} = require('../controllers/AppointmentController.js');
const userAuth = require("./middlewares/userAuth");


//gets list of all departments
router.get('/departments', getDepartments);

//gets appointment by id
router.get('/appointments/:id', getAppointmentById);

//get all appointments based on body params
router.post('/appointments', userAuth, getAppointments);

//create an empty slot 
router.post('/appointments/add', createAppointmentSlot);

//book an appointment (basically update an empty slot )
router.put('/appointments/', bookAppointment);

//update an appointment by id
router.put('/appointments/:id', updateAppointmentById);

//delete appointment by id
router.delete('/appointments/', deleteAppointment);

module.exports = router