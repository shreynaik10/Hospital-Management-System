import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import Box from '@mui/material/Box';

function Adddoctor() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [passwordMatchDisplay, setPasswordMatchDisplay] = useState('none');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('')
  const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const handleDialogueOpen = () => {
    setErrorDialogueBoxOpen(true)
  };
  const handleDialogueClose = () => {
    setErrorList([]);
    setErrorDialogueBoxOpen(false)
  };

  const adddoctor = (event) => {
    event.preventDefault();
    // TODO: Handle doctor form submission'
    const form = document.forms.adddoctorForm;
    let doctor = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      username: form.username.value,
      email: form.email.value,
      phone: form.phone.value,
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
      department: form.department.value
    }


    fetch('http://localhost:3001/doctors', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doctor)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let respMessage = data.message;
        if (respMessage === "success") {
          navigate("/doctors");
        }
        else {
          //Display error message
          setErrorList(data.errors);
          handleDialogueOpen();
        }
      });
  };

  useEffect(() => {
    if (password.length > 0 && password?.trim()?.length <= 6) {
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

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <div className="page-wrapper">
        <div className="content">

          <div className="card-box">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h4 className="page-title">Add Doctor</h4>
              </div>
            </div>
            <div className="row">

              <div className="col-lg-8 offset-lg-2">
                <form id="adddoctorForm" name='adddoctorForm' onSubmit={adddoctor}>
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
                        <select name="department" className="form-select" value={department} onChange={(event) => setDepartment(event.target.value)}>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Gynecology">Gynecology</option>
                          <option value="Hematology">Hematology</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="m-t-20 text-center">
                    <button id="adddoctor" type="submit" className="btn btn-primary submit-btn">Create Doctor</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ErrorDialogueBox
          open={errorDialogueBoxOpen}
          handleToClose={handleDialogueClose}
          ErrorTitle="Error: Add doctor"
          ErrorList={errorList}
        />
      </div>
    </Box>
  )
}

export default Adddoctor;
