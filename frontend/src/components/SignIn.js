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

    const handleLogin = async (e) => {
        e.preventDefault();
        const userData = { email, password };
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const result = await axios.post('http://localhost:5000/api/signin', userData, headers);//https://book-shelf-xvxk.onrender.com
            console.log('result:', result);
            const response = result.data;
            console.log('response:', response);
            if (typeof response !== "undefined" && typeof response.success !== "undefined" && response.success === true) {
                await login(response.user);
                console.log('navigated');
            } else {
                console.log('message:', response.message);
                setMessage(response.message);
            }
        } catch (error) {
            console.log('Error while login:', error);
        }
    }

    return (
        <>
            {isSignIn ? <div id="signInDiv">
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                        <button type="submit">Sign In</button>
                    </div>
                    
                    <p id="terms_policy">By signing in, you agree to the BookShelf Terms of Service and Privacy Policy</p>
                    <p id="loginFailureMessage">{messsage}</p>
                </form>
                <p id="newToBookshelf">New To Bookshelf? <button type="button" onClick={(e) => setIsSignIn(false)}>Sign Up</button></p>
            </div> : <SignUp onSignInClick={() => setIsSignIn(true)} />}
        </>
    );
}

export default SignIn;