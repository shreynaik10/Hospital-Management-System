const User = require("../models/user.js");
const Patient = require("../models/patient.js");
const Doctor = require("../models/doctor.js");


const getUsers = async (req, res) => {

    try {

        var name = req.query.name;
        var role = req.query.role;

        let conditions = [];

        if (name) {
            conditions.push({ firstName: name });
            conditions.push({ lastName: name });
        }

        if (role) {
            conditions.push({ userType: role });
        }
        //console.log(role);
        let users = [];
        if (conditions.length === 0) {
            users = await User.find({});
        } else {
            console.log(conditions);

            users = await User.find({
                $or: conditions
            });
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const isUserValid = (newUser) => {
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
    if (!newUser.userType) {
        errorList[errorList.length] = "Please enter User Type";
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

const saveUser = async (req, res) => {
    let newUser = req.body;
    let userValidStatus = isUserValid(newUser);
    if (!userValidStatus.status) {
        res.status(400).json({
            message: 'error',
            errors: userValidStatus.errors
        });
    }
    else {
        const newUser = new User(req.body);

        User.create(
            {
                email: newUser.email,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                password: newUser.password,
                userType: newUser.userType,
                activated: true
            },
            (error, userDetails) => {
                if (error) {
                    res.status(400).json({ message: "error", errors: [error.message] });
                } else {

                    if (newUser.userType === "Doctor") {
                        Doctor.create(
                            {
                                userId: userDetails._id,
                                firstName: newUser.firstName,
                                lastName: newUser.lastName,
                                email: newUser.email
                            },
                            (error2, doctorDetails) => {
                                if (error2) {
                                    User.deleteOne({ _id: userDetails });
                                    res.status(400).json({ message: "error", errors: [error2.message] });
                                } else {
                                    res.status(201).json({ message: "success" });
                                }
                            }
                        );
                    }
                    if (newUser.userType === "Patient") {
                        Patient.create(
                            {
                                userId: userDetails._id,
                                firstName: newUser.firstName,
                                lastName: newUser.lastName,
                                email: newUser.email
                            },
                            (error2, patientDetails) => {
                                if (error2) {
                                    User.deleteOne({ _id: userDetails });
                                    res.status(400).json({ message: "error", errors: [error2.message] });
                                } else {
                                    res.status(201).json({ message: "success" });
                                }
                            }
                        );
                    }
                }
            }
        );

    }
}

const updateUser = async (req, res) => {
    let newUser = req.body;
    let userValidStatus = isUserValid(newUser);
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

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user.userType == 'Doctor') {
            const deleteddoctor = await Doctor.deleteOne({ userId: req.params.id });
        }

        if (user.userType == 'Patient') {
            const deletedpaient = await Patient.deleteOne({ userId: req.params.id });
        }

        const deleteduser = await User.deleteOne({ _id: req.params.id });
        res.status(200).json(deleteduser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getUsers,
    getUserById,
    saveUser,
    updateUser,
    deleteUser
}