import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import "./SignIn.css";
import SignUp from "./SignUp.js";
import axios from "axios";

const SignIn = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [messsage, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        document.getElementById('signIn').innerText = "Signing In...";
        const userData = { email, password };
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            console.log('process.env.REACT_APP_SERVER_URL:'+process.env.REACT_APP_SERVER_URL);
            const result = await axios.post(process.env.REACT_APP_SERVER_URL+'api/signin', userData, headers);//https://book-shelf-xvxk.onrender.com
            console.log('result:', result);
            const response = result.data;
            console.log('response:', response);
            if (typeof response.success !== "undefined" && response.success === true) {
                await login(response.user);
                console.log('navigated');
            } else {
                console.log('message:', response.message);
                setMessage(response.message);
            }
            document.getElementById('signIn').innerText = 'Sign In';
        } catch (error) {
            console.log('Error while login:', error);
        }
    }

    const validateEmail = () => {
        console.log('email:', emailError);
        if (!email.trim()) {
            setEmailError('Email is required.');
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            setEmailError('Please enter valid email address.');
        } else {
            setEmailError('');
        }
    }

    const validatePasswword = () => {
        console.log('password:', password);
        if (!password.trim()) {
            setPasswordError('Password is required.');
        } else {
            setPasswordError('');
        }
    }

    return (
        <>
            {isSignIn ? <div id="signInDiv">
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyUp={validateEmail} required />
                        {emailError && <p className="errorMessage">{emailError}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyUp={validatePasswword} required />
                        {passwordError && <p className="errorMessage">{passwordError}</p>}
                    </div>
                    <div>
                        <button type="submit" id="signIn" disabled={emailError || passwordError}>Sign In</button>
                    </div>

                    <p id="terms_policy">By signing in, you agree to the BookShelf Terms of Service and Privacy Policy</p>
                    {messsage ? <p className="failureMessage">{messsage}</p> : ''}
                </form>
                <p id="newToBookshelf">New To Bookshelf? <button type="button" onClick={(e) => setIsSignIn(false)}>Sign Up</button></p>
            </div> : <SignUp onSignInClick={() => setIsSignIn(true)} />}
        </>
    );
}

export default SignIn;