const Prescription = require("../models/prescription.js");
const Appointment = require("../models/appointment.js");

const getPrescriptions = async (req, res) => {
    try {
        let searchpatient = req.body.patientId;

        // let searchdoctor = req.body.doctorId;
        let searchdoctor = req.sender.doctorId;
        
        let prescriptions = [];
        let userType = req.sender.userType;
        if (userType == 'Patient') {
            let patientId = req.sender.patientId;
            //console.log(patientId);
            prescriptions = await Prescription.find({}).populate({
                path: 'prescribedMed.medicineId',
            }).populate({
                path: 'appointmentId',
                match: { patientId: patientId },
                populate: [
                    {
                        path: 'patientId',
                        populate: {
                            path: 'userId'
                        },
                    },
                    {
                        path: 'doctorId',
                        populate: {
                            path: 'userId'
                        }
                    }
                ]
            }).then((prescriptions) => prescriptions.filter((pre => pre.appointmentId != null)));
            

        } else if (userType == 'Doctor') {
            let matchdoctorpatient = {};
            /*
            if(searchpatient){
                matchdoctorpatient = {patientId:searchpatient ,doctorId:req.sender.doctorId };
            }else{
                matchdoctorpatient = {doctorId : req.sender.doctorId}
            }
            */
            if(searchpatient){
                matchdoctorpatient = {patientId:searchpatient};
            }

            if(searchdoctor){
                matchdoctorpatient = {doctorId:searchdoctor};
            }

            if(searchpatient && searchdoctor){
                matchdoctorpatient = {patientId:searchpatient,doctorId:searchdoctor};
            }
            
            prescriptions = await Prescription.find({}).populate({
                path: 'prescribedMed.medicineId',
            }).populate({
                path: 'appointmentId',
                match: matchdoctorpatient,
                populate: [
                    {
                        path: 'patientId',
                        populate: {
                            path: 'userId'
                        }
                    },
                    {
                        path: 'doctorId',
                        populate: {
                            path: 'userId'
                        }
                    }
                ]
            }).then((prescriptions) => prescriptions.filter((pre => pre.appointmentId != null)));

        } else {
            let matchdoctorpatient = {};
            /*
            if(searchpatient){
                matchdoctorpatient = {patientId:searchpatient ,doctorId:req.sender.doctorId };
            }else{
                matchdoctorpatient = {doctorId : req.sender.doctorId}
            }
            */
            if(searchpatient){
                matchdoctorpatient = {patientId:searchpatient};
            }

            if(searchdoctor){
                matchdoctorpatient = {doctorId:searchdoctor};
            }

            if(searchpatient && searchdoctor){
                matchdoctorpatient = {patientId:searchpatient,doctorId:searchdoctor};
            }
            //console.log(matchpatient);

            prescriptions = await Prescription.find({}).populate({
                path: 'prescribedMed.medicineId',
            }).populate({
                path: 'appointmentId',
                match: matchdoctorpatient,
                populate: [
                    {
                        path: 'patientId',
                        populate: {
                            path: 'userId',
                        }
                    },
                    {
                        path: 'doctorId',
                        populate: {
                            path: 'userId'
                        }
                    }
                ]
            }).then((prescriptions) => prescriptions.filter((pre => pre.appointmentId != null)));
        }

        res.json({ message: "success", 'prescriptions': prescriptions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const savePrescription = async (req, res) => {
    let prescription = req.body;
    //console.log(prescription);
    Prescription.create(prescription,
        (error, prescriptionDetails) => {
            if (error) {
                res.status(400).json({ message: 'error', errors: [error.message] });
            } else {
                Appointment.findByIdAndUpdate(prescription.appointmentId, { completed: 1 },
                    function (err, docs) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            res.status(201).json({ message: 'success' });
                        }
                    });
            }
        }
    );
}


module.exports = {
    getPrescriptions,
    savePrescription
}