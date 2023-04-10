import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom'
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Box from '@mui/material/Box';
import { UserContext } from '../../Context/UserContext'
import moment from 'moment';
import PrescriptionTable from '../MUITable/PrescriptionTable';



function PatientHistory() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDOB] = useState('');
  const [userId, setUserId] = useState('');
  const [patientId, setPatientId] = useState('');
  const { id } = useParams();
  const [prescriptions, setPrescription] = useState([]);  
  

  useEffect(() => {
    getPatientById();
  }, []);

  const getPatientById = async () => {
    // let patientUserId = currentUser.userId;
    const response = await axios.get(`http://localhost:3001/patients/${id}`);
    // console.log(response);
    setPatientId(response.data._id);
    setFirstName(response.data.userId.firstName);
    setLastName(response.data.userId.lastName);
    setEmail(response.data.userId.email);
    setUsername(response.data.userId.username);
    setPassword(response.data.userId.password);
    setConfirmPassword(response.data.userId.password);
    setPhone(response.data.phone);
    setAddress(response.data.address);
    setUserId(response.data.userId._id);
    setGender(response.data.gender);
    setDOB(response.data.dob);
  };

  

  const getHistory = async () =>{
    let response = await axios.get(`http://localhost:3001/patients/history/${patientId}`, 
        {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
    // console.log(response.data)
    if (response.data.message == "success") {
        let respPrescription = response.data.prescriptions;
        let newResp =respPrescription.sort((a, b) => {
                const timeA = new Date(`${moment(new Date(a.appointmentId.appointmentDate.slice(0, -1))).format('MM/DD/YYYY')} ${a.appointmentId.appointmentTime}`);
                const timeB = new Date(`${moment(new Date(b.appointmentId.appointmentDate.slice(0, -1))).format('MM/DD/YYYY')} ${b.appointmentId.appointmentTime}`);
                console.log(timeA)
                return timeB - timeA;
            });
        //   console.log(newResp);
        setPrescription(newResp);
    }
  }


  useEffect(() => {
    getHistory()
  }, [password, confirmPassword])

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <div className="page-wrapper">
        <div className="content">
          <div className="mt-5">
            <div className="row">
              <div className="col-lg-8 ">
                <h3 className='px-3 mx-3 my-2'>Patient Profile</h3>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-8 px-4 mx-4">
                {/* <form id="addPatientForm" name='addPatientForm' onSubmit={updatePatient}> */}
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>First Name <span className="text-danger">*</span></label>
                        <input name="firstName" className="form-control" type="text" disabled required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Last Name</label>
                        <input name="lastName" className="form-control" type="text" disabled required value={lastName} onChange={(event) => setLastName(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Username <span className="text-danger">*</span></label>
                        <input name="username" className="form-control" type="text" disabled required value={username} onChange={(event) => setUsername(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Email <span className="text-danger">*</span></label>
                        <input name="email" className="form-control" type="email" disabled required value={email} onChange={(event) => setEmail(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Phone </label>
                        <input name="phone" className="form-control" type="text" disabled value={phone} onChange={(event) => setPhone(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Address </label>
                        <input name="address" className="form-control" type="text" disabled value={address} onChange={(event) => setAddress(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" className="form-select" value={gender} disabled onChange={(event) => setGender(event.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Date of Birth </label>
                        <input name="dob" className="form-control" type="date" disabled value={dob} onChange={(event) => setDOB(event.target.value)} />
                      </div>
                    </div>
                  </div>
                  
                {/* </form> */}
              </div>
            </div>
          </div>
        </div>
        <h3 className='p-3 m-3'>Patient History</h3>
        <PrescriptionTable prescriptionList={prescriptions} />
        
      </div>
    </Box>
  )
}

export default PatientHistory;
