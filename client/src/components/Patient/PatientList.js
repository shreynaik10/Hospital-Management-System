import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import Box from '@mui/material/Box';
import PatientTable from '../MUITable/PatientTable';

function PatientList() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');

    const [patients, setPatient] = useState([]);

    const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
    const [errorList, setErrorList] = useState([]);
    const handleDialogueOpen = () => {
        setErrorDialogueBoxOpen(true)
    };
    const handleDialogueClose = () => {
        setErrorList([]);
        setErrorDialogueBoxOpen(false)
    };

    useEffect(() => {
        getPatients();
    }, []
    );

    const getPatients = async () => {
        const response = await axios.get("http://localhost:3001/patients", {
            params: {
                name: name
            }
        });
        setPatient(response.data);
    };

    const deletePatient = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/patients/${id}`);
            getPatients();
        } catch (error) {
            setErrorList(error);
            handleDialogueOpen();
        }
    };


    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-sm-4 col-3">
                            <h4 className="page-title">Patient</h4>
                        </div>
                        <div className="col-sm-8 col-9 text-right m-b-20">
                            <Link to="/patients/add" className="btn btn-primary float-right btn-rounded">
                                <i className="fa fa-plus"></i> Add Patient
                            </Link>
                        </div>
                    </div>
                    <form action="/patients" name="userFilter" >
                        <div className="row filter-row">

                            <div className="col-sm-4 col-md-4">
                                <div className="form-floating">
                                    <input type="text" name="name" className="form-control" placeholder='Patient Name' />
                                    <label className="focus-label">Patient Name</label>
                                </div>
                            </div>

                            <div className="col-sm-4 col-md-4">
                                <button type="submit" className="btn btn-primary btn-block"> Search </button>
                            </div>
                        </div>
                    </form>
                    <PatientTable patientList={patients} deletePatient={deletePatient} />
                    {/* <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <table className="table table-striped custom-table">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Gender</th>
                                            <th>Address</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map((patient, index) => (
                                            <tr key={patient._id}>
                                                <td>{index + 1}</td>
                                                <td>{patient.userId.firstName} {patient.userId.lastName}</td>
                                                <td>{patient.userId.email}</td>
                                                <td>{patient.phone}</td>
                                                <td>{patient.gender}</td>
                                                <td>{patient.address}</td>
                                                <td>
                                                    <Link
                                                        to={`/patients/edit/${patient._id}`}
                                                        className="btn btn-warning is-info is-small m-r-2"
                                                    >
                                                        <i className="fa fa-pencil m-r-5"></i> Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deletePatient(patient._id)}
                                                        className="btn btn-danger is-danger is-small m-l-5"
                                                    >
                                                        <i className="fa fa-trash-o m-r-5"></i>  Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> */}
                </div>
                <ErrorDialogueBox
                    open={errorDialogueBoxOpen}
                    handleToClose={handleDialogueClose}
                    ErrorTitle="Error: Add Patient"
                    ErrorList={errorList}
                />
            </div>

        </Box>
    )
}

export default PatientList;
