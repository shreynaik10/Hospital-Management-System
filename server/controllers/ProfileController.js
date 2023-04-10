const User = require("../models/user.js");
const Patient = require("../models/patient.js");
const Doctor = require("../models/doctor.js");

const getAdminByUserId = async (req, res) => {
    //console.log(req.params.id);
    try {
        const admin = await User.findOne({_id : req.params.id});
        res.json(admin);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const isAdminValid = (newUser) => {
    let errorList = [];
    if (!newUser.firstName) {
        errorList[errorList.length] = "Please enter first name";
    }
    if (!newUser.lastName) {
        errorList[errorList.length] = "Please enter last name";
    }
    if (!newUser.email) {
        errorList[errorList.length] = "Please enter email";
    }
    if (!newUser.password) {
        errorList[errorList.length] = "Please enter password";
    }
    if (!newUser.confirmPassword) {
        errorList[errorList.length] = "Please re-enter password in Confirm Password field";
    }
    
    if (!(newUser.password == newUser.confirmPassword)) {
        errorList[errorList.length] = "Password and Confirm Password did not match";
    }

    if (errorList.length > 0) {
        result = {
            status: false,
            errors: errorList
        }
        return result;
    }
    else {
        return { status: true };
    }

}

const updateAdmin = async (req, res) => {
    console.log(req.body);
    let newUser = req.body;
    let userValidStatus = isAdminValid(newUser);
    if (!userValidStatus.status) {
        res.status(400).json({
            message: 'error',
            errors: userValidStatus.errors
        });
    }
    else {
        try {
            const updateduser = await User.updateOne({ _id: req.params.id }, { $set: req.body });
            res.status(201).json({ message: 'success' });
        } catch (error) {
            res.status(400).json({ message: 'error', errors: [error.message] });
        }
    }
}


const getDoctorByUserId = async (req, res) => {
    //console.log(req.params.id);
    try {
        const doctor = await Doctor.findOne({userId : req.params.id}).populate('userId');
        res.json(doctor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const isDoctorValid = (newdoctor) => {
    let errorList = [];
    if (!newdoctor.firstName) {
        errorList[errorList.length] = "Please enter first name";
    }
    if (!newdoctor.lastName) {
        errorList[errorList.length] = "Please enter last name";
    }
    if (!newdoctor.email) {
        errorList[errorList.length] = "Please enter email";
    }
    if (!newdoctor.password) {
        errorList[errorList.length] = "Please enter password";
    }
    if (!newdoctor.confirmPassword) {
        errorList[errorList.length] = "Please re-enter password in Confirm Password field";
    }
    if (!(newdoctor.password == newdoctor.confirmPassword)) {
        errorList[errorList.length] = "Password and Confirm Password did not match";
    }

    if (errorList.length > 0) {
        result = {
            status: false,
            errors: errorList
        }
        return result;
    }
    else {
        return { status: true };
    }

}


const updateDoctor = async (req, res) => {
    console.log(req.body);
    let newdoctor = req.body;

    let doctorValidStatus = isDoctorValid(newdoctor);
    if (!doctorValidStatus.status) {
        res.status(400).json({
            message: 'error',
            errors: doctorValidStatus.errors
        });
    }
    else {
        try {

            const updateddoctor = await Doctor.updateOne({ _id: req.params.id }, { $set: { "phone": req.body.phone, "department": req.body.department } });

            const updateduser = await User.updateOne({ _id: req.body.userId }, { $set: { "firstName": req.body.firstName, "lastName": req.body.lastName,"email":req.body.email, "username": req.body.username, "password": req.body.password } });

            res.status(201).json({ message: 'success' });
        } catch (error) {
            res.status(400).json({ message: 'error', errors: [error.message] });
        }
    }
}

const getPatientByUserId = async (req, res) => {
    try {
        const patient = await Patient.findOne({userId : req.params.id}).populate('userId');
        res.json(patient);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const isPatientValid = (newPatient) => {
    let errorList = [];
    if (!newPatient.firstName) {
        errorList[errorList.length] = "Please enter first name";
    }
    if (!newPatient.lastName) {
        errorList[errorList.length] = "Please enter last name";
    }
    if (!newPatient.email) {
        errorList[errorList.length] = "Please enter email";
    }
    if (!newPatient.password) {
        errorList[errorList.length] = "Please enter password";
    }
    if (!newPatient.confirmPassword) {
        errorList[errorList.length] = "Please re-enter password in Confirm Password field";
    }
    if (!(newPatient.password == newPatient.confirmPassword)) {
        errorList[errorList.length] = "Password and Confirm Password did not match";
    }
    if (!newPatient.phone) {
        errorList[errorList.length] = "Please enter phone";
    }

    if (errorList.length > 0) {
        result = {
            status: false,
            errors: errorList
        }
        return result;
    }
    else {
        return { status: true };
    }

}


const updatePatient = async (req, res) => {
    let newPatient = req.body;
    let PatientValidStatus = isPatientValid(newPatient);
    if (!PatientValidStatus.status) {
        res.status(400).json({
            message: 'error',
            errors: PatientValidStatus.errors
        });
    }
    else {
        try {
            const updatedPatient = await Patient.updateOne({ _id: req.params.id }, { $set: { "phone": req.body.phone, "address": req.body.address, "gender": req.body.gender,"dob": req.body.dob } });

            const updateduser = await User.updateOne({ _id: req.body.userId }, { $set: { "firstName": req.body.firstName, "lastName": req.body.lastName,"email":req.body.email, "username": req.body.username, "password": req.body.password } });

            res.status(201).json({ message: 'success' });
        } catch (error) {
            res.status(400).json({ message: 'error', errors: [error.message] });
        }
    }
}


module.exports = {
    getAdminByUserId,
    updateAdmin,
    getDoctorByUserId,
    updateDoctor,
    getPatientByUserId,
    updatePatient,
}