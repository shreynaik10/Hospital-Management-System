import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom'
import { useNavigate, useParams } from "react-router-dom";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import axios from "axios";
import Box from '@mui/material/Box';
import { UserContext } from '../../Context/UserContext'

function DoctorProfile() {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [userId, setUserId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [passwordMatchDisplay, setPasswordMatchDisplay] = useState('none');
    const [passwordValidationMessage, setPasswordValidationMessage] = useState('');

    const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
    const [errorList, setErrorList] = useState([]);
    const handleDialogueOpen = () => {
        setErrorDialogueBoxOpen(true)
    };
    const handleDialogueClose = () => {
        setErrorList([]);
        setErrorDialogueBoxOpen(false)
    };

  
    const getdoctorById = async () => {
        let doctorUserId = currentUser.userId;
    
        const response = await axios.get(`http://localhost:3001/profile/doctor/`+doctorUserId);
        console.log(response.data._id);
        setDoctorId(response.data._id);
        setFirstName(response.data.userId.firstName);
        setLastName(response.data.userId.lastName);
        setEmail(response.data.userId.email);
        setUsername(response.data.userId.username);
        setPassword(response.data.userId.password);
        setConfirmPassword(response.data.userId.password);
        setPhone(response.data.phone);
        setDepartment(response.data.department);
        setPassword(response.data.userId.password);
        setUserId(response.data.userId._id);
    };

    const updatedoctoruser = async (e) => {
        e.preventDefault();
        //let doctorId = doctorId;
        //alert("doctorId"+doctorId);
        
        try {
            await axios.patch(`http://localhost:3001/profile/doctor/${doctorId}`, {
                firstName,
                lastName,
                username,
                email,
                phone,
                password,
                confirmPassword,
                department,
                userId
            });
            navigate("/profile");
        } catch (error) {

            console.log(error);
            //Display error message
            setErrorList(error.response.data.errors);
            handleDialogueOpen();
        }
    };


    useEffect(() => {
        if ((typeof password !== 'undefined') && password.length > 0 && password?.trim()?.length <= 6) {
            setPasswordValidationMessage('Password Length must be greater than 6 characters');
        }
        else {
            setPasswordValidationMessage('');
        }
        if (password === confirmPassword) {
            setPasswordMatchDisplay('none');
        }
        else {
            setPasswordMatchDisplay('block');
        }
    }, [password, confirmPassword])

    useEffect(() => {
        getdoctorById();
    }, []);


    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <div className="page-wrapper">
                <div className="content">

                    <div className="card-box">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <h3 className="page-title">Update Profile</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <form id="editdoctorForm" name='editdoctorForm' onSubmit={updatedoctoruser}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>First Name <span className="text-danger">*</span></label>
                                                <input name="firstName" className="form-control" type="text" required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Last Name</label>
                                                <input name="lastName" className="form-control" type="text" required value={lastName} onChange={(event) => setLastName(event.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Username <span className="text-danger">*</span></label>
                                                <input name="username" className="form-control" type="text" required value={username} onChange={(event) => setUsername(event.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Email <span className="text-danger">*</span></label>
                                                <input name="email" className="form-control" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input name="password" className="form-control" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Confirm Password</label>
                                                <input name="confirmPassword" className="form-control" type="password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Phone </label>
                                                <input name="phone" className="form-control" type="text" value={phone} onChange={(event) => setPhone(event.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Department</label>
                                                <select disabled name="department" className="form-select" value={department} onChange={(event) => setDepartment(event.target.value)}>
                                                    <option value="Cardiology">Cardiology</option>
                                                    <option value="Gynecology">Gynecology</option>
                                                    <option value="Hematology">Hematology</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="m-t-20 text-center">
                                        <button type="submit" className="btn btn-primary submit-btn">Update Profile</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <ErrorDialogueBox
                    open={errorDialogueBoxOpen}
                    handleToClose={handleDialogueClose}
                    ErrorTitle="Error: Edit doctor"
                    ErrorList={errorList}
                />
            </div>
        </Box>
    )
}

export default DoctorProfile;
