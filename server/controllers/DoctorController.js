const Doctor = require("../models/doctor.js");
const User = require("../models/user.js");

const getDoctors = async (req, res) => {

    try {

        var searchdoctor = new RegExp(req.query.name, 'i');

        let doctors = [];
        if (!searchdoctor) {
            doctors = await Doctor.find({}).populate('userId');
        } else {
            doctors = await Doctor.find().populate({
                path: 'userId',
                select: 'firstName lastName email username',
                match: {
                    $or: [
                        { firstName: { $regex: searchdoctor } },
                        { lastName: { $regex: searchdoctor } },
                        { email: { $regex: searchdoctor } }
                    ]
                }
            }).then((doctors) => doctors.filter((doctor => doctor.userId != null)));
        }

        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDoctorById = async (req, res) => {
    //console.log(req.params.id);
    try {
        const doctor = await Doctor.findById(req.params.id).populate('userId');
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

const saveDoctor = async (req, res) => {
    let newdoctor = req.body;

    let doctorValidStatus = isDoctorValid(newdoctor);
    if (!doctorValidStatus.status) {
        res.status(400).json({
            message: 'error',
            errors: doctorValidStatus.errors
        });
    }
    else {

        User.create(
            {
                email: newdoctor.email,
                username: newdoctor.username,
                firstName: newdoctor.firstName,
                lastName: newdoctor.lastName,
                password: newdoctor.password,
                userType: 'Doctor',
                activated: true,
            },
            (error, userDetails) => {
                if (error) {
                    res.status(400).json({ message: "error", errors: [error.message] });
                } else {
                    newdoctor.userId = userDetails._id,
                        Doctor.create({ newdoctor },
                            (error2, doctorDetails) => {
                                if (error2) {
                                    User.deleteOne({ _id: userDetails });
                                    res.status(400).json({ message: 'error', errors: [error2.message] });
                                } else {
                                    res.status(201).json({ message: 'success' });
                                }
                            }
                        );
                }
            }
        );
    }
}

const updateDoctor = async (req, res) => {
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

            const updateduser = await User.updateOne({ _id: req.body.userId }, { $set: { "firstName": req.body.firstName, "lastName": req.body.lastName, "email": req.body.email, "username": req.body.username, "password": req.body.password } });

            res.status(201).json({ message: 'success' });
        } catch (error) {
            res.status(400).json({ message: 'error', errors: [error.message] });
        }
    }
}

const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('userId');

        const deleteddoctor = await Doctor.deleteOne({ _id: req.params.id });

        const deleteduser = await User.deleteOne({ _id: doctor.userId._id });
        res.status(200).json(deleteddoctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getDoctors,
    getDoctorById,
    saveDoctor,
    updateDoctor,
    deleteDoctor
}