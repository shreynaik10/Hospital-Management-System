const jwt = require("jsonwebtoken");
const adminAuth = require("./adminAuth");
const doctorAuth = require("./doctorAuth");
const patientAuth = require("./patientAuth");
const Patient = require('../../models/patient');
const mongoose = require("mongoose");
const Doctor = require("../../models/doctor");


function userAuth(req, res, next) {
    // console.log("adminAuth hit",);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // console.log("adminAuth ",payload);
        req.sender = {
            "id": payload.id,
            "userType": payload.userType
        };
        if (payload.userType == "Admin") {
            // adminAuth(req,res,next);
        }
        else if (payload.userType == "Doctor") {
            // doctorAuth(req,res,next);
            let doctor = await Doctor.findOne({
                'userId': mongoose.Types.ObjectId(req.sender.id)
            })
            req.sender.doctorId = doctor._id;
        }
        else if (payload.userType == "Patient") {
            // patientAuth(req,res,next);
            let patient = await Patient.findOne({
                'userId': mongoose.Types.ObjectId(req.sender.id)
            })
            // console.log("inside user auth. patient",req.sender.id)
            // console.log("inside user auth. patient",patient)
            req.sender.patientId = patient._id;
        }
        else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    });

}

module.exports = userAuth;
