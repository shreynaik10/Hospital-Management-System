const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Doctor = require("../../models/doctor");


function doctorAuth(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.sender = {
            "id": payload.id,
            "userType": payload.userType
        };
        // console.log("doctorAuth ", payload);
        if (payload.userType == "Doctor") {
            let doctor = await Doctor.findOne({
                'userId': mongoose.Types.ObjectId(req.sender.id)
            })
            req.sender.doctorId = doctor._id;
            next();
        }
        else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });

}

module.exports = doctorAuth;
