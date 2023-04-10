import React, { useContext, useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from "react-router-dom";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import { UserContext } from '../../Context/UserContext'

function Login() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
    const [errorList, setErrorList] = useState([]);

    const { signInUser } = useContext(UserContext);

    const handleDialogueOpen = () => {
        setErrorDialogueBoxOpen(true)
    };
    const handleDialogueClose = () => {
        setErrorList([]);
        setErrorDialogueBoxOpen(false)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Handle login form submission
        const form = document.forms.loginForm;
        let user = {
            email: form.email.value,
            password: form.password.value
        }
        fetch('http://localhost:3001/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => {
                let respMessage = data.message;
                let user = data.user;
                if (respMessage === "success") {
                    signInUser(user, data.token);
                    navigate("/");
                }
                else {
                    //TODO: display error message
                    setErrorList(data.errors);
                    handleDialogueOpen();
                }
            });
    };

    const signUpClicked = () => {
        navigate("/signup");
    }

    return (
        <div id={styles.loginBody}>
            <div className={styles.greenLayer1}>
                <div id={styles.loginFormDiv}>
                    <p>Welcome back! Please login to your account</p>
                    <form onSubmit={handleSubmit} className="col-6" name="loginForm" id="loginForm">
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

                        <div className='form-floating mt-4 col-12 mx-2'>
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
                        <div className='d-flex flex-column flex-md-row  mx-2 mt-5 justify-content-between'>
                            <button className='col-12 col-md-6' id={styles.loginBtn} type="submit">Login</button>
                            <button className={["col-12 col-md-6 mt-3 mt-md-0", styles.signUpBtn].join(" ")} onClick={signUpClicked} >Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
            <ErrorDialogueBox
                open={errorDialogueBoxOpen}
                handleToClose={handleDialogueClose}
                ErrorTitle="Login Error"
                ErrorList={errorList}
            />
        </div>
    );
}

export default Login;
