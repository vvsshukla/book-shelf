import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import "./SignIn.css";
const SignUp = ({ onSignInClick }) => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messsage, setMessage] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    //const [loginUser, setLoginUser] = useState({});
    const {login} = useAuth();
    const signUp = async () => {
        document.getElementById('signUp').innerText = "Signing Up...";
        console.log('firstName:', firstname);
        console.log('lastName:', lastname);
        const userData = { firstname, lastname, email, password };
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const result = await axios.post('http://localhost:5000/api/signup', userData, headers);
            //http://localhost:5000/api/signup
            const response = result.data;
            // const response = {
            //     "success": true,
            //     "message": "Registration Successful",
            //     "user": {
            //         "_id": "6616cdd60a355b5cfb00435f",
            //         "firstname": "vaibhav",
            //         "lastname": "shukla",
            //         "email": "vaibhav125shukla@gmail.com",
            //         "password": "$2a$10$CKP/bVd.f17P2vu4yGoQ6eIobzEJzGAZ0ZjqD3moGcseFIMMhka36",
            //         "createdAt": "2024-04-10T17:35:18.332Z",
            //         "lastLoggedIn": "2024-04-10T17:58:14.734Z",
            //         "__v": 0
            //     }
            // };
            console.log('response:', response);
            if (typeof response.success !== "undefined" && response.success === true) {
                await login(response.newUser);
            } else {
                console.log('message:', response.message);
                setMessage(response.message);
            }
            document.getElementById('signUp').innerText = "Sign Up";
        } catch (error) {
            //Handle registration failure
            console.log('Error registering user:', error);
        }
    }

    const validateSignUp = (event) => {
        switch(event.target.id) {
            case 'firstname':
                console.log('firstname:', firstname.trim());
                if (!firstname.trim()) {
                    setFirstNameError('firstname is required.');
                } else if (!(/^[a-zA-Z]{2,}$/.test(firstname.trim()))) {
                    setFirstNameError('firstname must contain only alphabets with at least two characters.');
                } else {
                    setFirstNameError('');
                }
                break;
            case 'lastname':
                console.log('lastname:', lastname.trim());
                if (!lastname.trim()) {
                    setLastNameError('lastname is required.');
                } else if (!(/^[a-zA-Z]{2,}$/.test(lastname.trim()))) {
                    setLastNameError('lastname must contain only alphabets with at least two characters.');
                } else {
                    setLastNameError('');
                }
                break;
            case 'email':
                if (!email.trim()) {
                    setEmailError('Email is required.');
                } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
                    setEmailError('Please enter valid email address.');                
                } else {
                    setEmailError('');
                }
                break;
            case 'password':
                if (!password.trim()) {
                    setPasswordError('Password is required.');
                } else {
                    setPasswordError('');
                }
                break;    
        }
    }
    
    return (
        <>
            {<div id="signUpDiv">
                <h2>Sign Up</h2>
                <form>
                    <div>
                        <label htmlFor="">Firstname:</label>
                        <input type="text" id="firstname" value={firstname} onChange={(e) => setFirstName(e.target.value.trim())} onKeyUp={validateSignUp} required />
                        {firstNameError && <p className="errorMessage">{firstNameError}</p>}
                    </div>
                    <div>
                        <label htmlFor="">Lastname:</label>
                        <input type="text" id="lastname" value={lastname} onChange={(e) => setLastName(e.target.value.trim())} onKeyUp={validateSignUp} required />
                        {lastNameError && <p className="errorMessage">{lastNameError}</p>}
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} onKeyUp={validateSignUp} required />
                        {emailError && <p className="errorMessage">{emailError}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value.trim())} onKeyUp={validateSignUp} required />
                        {passwordError && <p className="errorMessage">{passwordError}</p>}
                    </div>
                    <div>
                        <button type="button" id="signUp" disabled={firstNameError||lastNameError||emailError||passwordError} onClick={(e) => signUp()}>Sign Up</button>
                    </div>
                    <div>By creating an account, you agree to the BookShelf Terms of Service and Privacy Policy.</div>
                    {messsage ? <p className="failureMessage">{messsage}</p> : ''}
                </form>
                <div id="alreadyAMember">Already a member? <button type="button" onClick={onSignInClick}>Sign In</button></div>
            </div>}
        </>
    )
}
//Object.keys(loginUser).length > 0 ? (<Dashboard user={loginUser} onClickLogoutUser={logoutUser} />) : 
export default SignUp;