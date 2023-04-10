const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();


const isLoginValid = (email, password) => {
    const errorList = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!email) {
        errorList.push("Please enter email");
    } else if (!emailRegex.test(email)) {
        errorList.push("Invalid email format");
    }

    if (!password) {
        errorList.push("Please enter password");
    }
    // else if (!passwordRegex.test(password)) {
    //     errorList.push(
    //         "Password should be at least 8 characters long and contain at least one letter and one number"
    //     );
    // }

    if (errorList.length > 0) {
        return { status: false, errors: errorList };
    } else {
        return { status: true };
    }
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    const loginValidStatus = isLoginValid(email, password);
    if (!loginValidStatus.status) {
        res.status(400).json({ message: "error", errors: loginValidStatus.errors });
    } else {
        User.findOne({ email: email }, (error, user) => {
            if (error) {
                res.status(400).json({ message: "error", errors: [error.message] });
            } else if (!user) {
                res.status(401).json({ message: "error", errors: ["User not found"] });
            } else {
                bcrypt.compare(password, user.password, (error2, result) => {
                    if (error2) {
                        res.status(401).json({ message: "error", errors: [error2.message] });
                    } else if (!result) {
                        res.status(401).json({ message: "error", errors: ["Invalid password"] });
                    } else {
                        const currentUser = {
                            "firstName": user.firstName,
                            "lastName": user.lastName,
                            "userType": user.userType,
                            "userId": user._id
                        };

                        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.SECRET_KEY, { expiresIn: "365d" });
                        res.json({ message: "success", user: currentUser, token: token });
                    }
                });
            }
        });
    }
};

module.exports = loginUser;

