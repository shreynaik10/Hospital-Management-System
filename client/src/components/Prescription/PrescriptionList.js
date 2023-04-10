import React, { useEffect, useState, useContext } from 'react';
import Header from '../Layout/Header/Header';
import Sidebar from '../Layout/Sidebar/Sidebar';
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import Box from '@mui/material/Box';
import PrescriptionTable from '../MUITable/PrescriptionTable';
import {UserContext} from '../../Context/UserContext'
import moment from 'moment';


function PrescriptionList() {

    const {currentUser} = useContext(UserContext);

    const params = new URLSearchParams(window.location.search);

    const [prescriptions, setPrescription] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [doctorList, setDoctorList] = useState([]);
    const [patientSelected, setPatientSelected] = useState("");
    const [doctorSelected, setDoctorSelected] = useState("");

    const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
    const [errorList, setErrorList] = useState([]);
    const handleDialogueOpen = () => {
        setErrorDialogueBoxOpen(true)
    };

    const handleDialogueClose = () => {
        setErrorList([]);
        setErrorDialogueBoxOpen(false)
    };

    const getPatients = async () => {
        const response = await axios.get("http://localhost:3001/patients");
        setPatientList(response.data);
    };

    const getDoctors = async () => {
        const response = await axios.get("http://localhost:3001/doctors");
        setDoctorList(response.data);
    };

    const getPrescription = async () => {

        const patientId = params.get('patientId');

        const doctorId = params.get('doctorId');

        let reqObj = {};
        if (doctorId) {
            setDoctorSelected(doctorId);
        }

        if (patientId) {
            setPatientSelected(patientId);
            
        }

        reqObj = {
            "patientId": patientId, "doctorId" : doctorId
        }
        
        let response = await axios.post(`http://localhost:3001/prescriptions`, reqObj,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        
        if (response.data.message == "success") {
            let respPrescription = response.data.prescriptions;
            let newResp =respPrescription.sort((a, b) => {
                    const timeA = new Date(`${moment(new Date(a.appointmentId.appointmentDate.slice(0, -1))).format('MM/DD/YYYY')} ${a.appointmentId.appointmentTime}`);
                    const timeB = new Date(`${moment(new Date(b.appointmentId.appointmentDate.slice(0, -1))).format('MM/DD/YYYY')} ${b.appointmentId.appointmentTime}`);
                    console.log(timeA)
                    return timeB - timeA;
                });
              console.log(newResp);
            setPrescription(newResp);
        } else {

        }
    };

    useEffect(() => {
        getPrescription()
        getPatients()
        getDoctors()
    }, []
    );

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

            <div className="page-wrapper">
                <div className="content">
                    <h4 className="page-title">Prescription</h4>
                    <form action="/prescriptions" name="prescriptionFilter" className= {currentUser.userType == "Patient" ? "hide" :""}  >
                        <div className="row filter-row">

                            <div className="col-sm-4 col-md-4 mt-2">
                                <select name="patientId" id="patientId" className="form-select" aria-label="Default select example" >
                                    <option value=''>Choose Patient</option>
                                    {
                                        patientList.map(patient => {
                                            if (patientSelected == patient._id) {
                                                return <option value={patient._id} selected>{patient.userId.firstName} {patient.userId.lastName}</option>
                                            }
                                            else {
                                                return <option value={patient._id} >{patient.userId.firstName} {patient.userId.lastName}</option>
                                            }

                                        })
                                    }
                                </select>
                            </div>
                            {currentUser.userType == 'Admin' && 
                                <div className="col-sm-4 col-md-4 mt-2">
                                    <select name="doctorId" id="doctorId" className="form-select" aria-label="Default select example" >
                                        <option value=''>Choose Doctor</option>
                                        {
                                            doctorList.map(doctor => {
                                                if (doctorSelected == doctor._id) {
                                                    return <option value={doctor._id} selected>{doctor.userId.firstName} {doctor.userId.lastName}</option>
                                                }
                                                else {
                                                    return <option value={doctor._id} >{doctor.userId.firstName} {doctor.userId.lastName}</option>
                                                }

                                            })
                                        }
                                    </select>
                                </div>
                            }
                            <div className="col-sm-4 col-md-4">
                                <button type="submit" className="btn btn-primary btn-block"> Search </button>
                            </div>
                        </div>
                    </form>
                    <PrescriptionTable prescriptionList={prescriptions} />
                </div>
            </div>
        </Box>
    )
}

export default PrescriptionList;
