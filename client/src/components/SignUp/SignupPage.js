import React, { useEffect, useState } from 'react';
import styles from './SignUp.module.css';
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';



function SignupPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [passwordMatchDisplay, setPasswordMatchDisplay] = useState('none');
  // const [passwordValidationDisplay, setPasswordValidationDisplay] = useState('none')
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


  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Handle signup form submission'
    const form = document.forms.signUpform;
    let user = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
      userType: form.userType.value
    }
    fetch('http://localhost:3001/signUp', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(data => {
        let respMessage = data.message;
        if (respMessage === "success") {
          navigate("/");
        }
        else {
          //TODO: display error message
          setErrorList(data.errors);
          handleDialogueOpen();
        }
      });
  };

  useEffect(() => {
    if (password.length > 0 && password?.trim()?.length <= 6) {
      setPasswordValidationMessage('Password Length must be greater than 6 characters');
      // setPasswordValidationDisplay('block');
    }
    else {
      setPasswordValidationMessage('');
      // setPasswordValidationDisplay('none');
    }
    if (password === confirmPassword) {
      setPasswordMatchDisplay('none');
    }
    else {
      setPasswordMatchDisplay('block');
    }
  }, [password, confirmPassword])

  return (
    <div id={styles.signUpBody}>

      <div id={styles.signUpBG}>
        <div className={styles.greenLayer}>

        </div>
      </div>
      <div>
        <h2>Create An Account</h2>
        <form id={styles.signUpform} name='signUpform' onSubmit={handleSubmit}>
          <div className='d-flex flex-column flex-lg-row flex-sm-column mt-5'>
            <div className='col-12 col-sm-12 col-lg-6  form-floating mx-2 '>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                placeholder="first name"
                value={firstName}
                required
                onChange={(event) => setFirstName(event.target.value)}
              />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className='col-12  col-sm-12 col-lg-6  mt-3 mt-sm-3 mt-lg-0 form-floating mx-2'>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                placeholder="last name"
                value={lastName}
                required
                onChange={(event) => setLastName(event.target.value)}
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>
          <div className='form-floating mt-3 col-12 mx-2'>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="form-control"
            />
            <label htmlFor="email" >Email</label>
          </div>
          <div className='form-floating mt-3 col-12 mx-2'>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-control"
              required
              placeholder="password"
            />
            <label htmlFor="password">Password</label>
          </div>
          <div
            className="mx-2 text-danger"
          > {passwordValidationMessage}</div>
          <div className='form-floating mt-3 col-12 mx-2'>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="form-control"
              required
              placeholder="confirm password"
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          <div
            className="mx-2 text-danger"
            style={{
              display: `${passwordMatchDisplay}`
            }}> Password did not match</div>
          <div className='form-floating mt-3 col-12 mx-2'>
            <select
              id="userType"
              name="userType"
              value={userType}
              onChange={(event) => setUserType(event.target.value)}
              className="form-select"
              required
            >
              <option value=""></option>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
            </select>
            <label htmlFor="userType">User Type</label>
          </div>
          <div className="form-group form-check mt-5 mx-2">
            <input type="checkbox" className="form-check-input" id="terms-chkbox" required />
            <label className='' htmlFor="terms-chkbox">I agree with the terms and conditons</label>
          </div>
          <div className='text-center'>
            <button id={styles.signUpBtn} type="submit">Sign Up</button>
          </div>
          <div className='text-center'>
            Already have an account? <NavLink to="/login" exact >Sign In</NavLink>
          </div>

        </form>
      </div>
      <ErrorDialogueBox
        open={errorDialogueBoxOpen}
        handleToClose={handleDialogueClose}
        ErrorTitle="Error Signing Up"
        ErrorList={errorList}
      />
    </div>
  );
}

export default SignupPage;
