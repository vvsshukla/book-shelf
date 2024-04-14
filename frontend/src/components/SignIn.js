import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import "./SignIn.css";
import SignUp from "./SignUp.js";
// import axios from "axios";
// import SignUp from "./SignUp.js";
// import Dashboard from "./Dashboard.js";

const SignIn = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        const userData = { email, password };
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            //const response = await axios.post('/api/signin', userData, headers);
            const response = {
                "success": true,
                "message": "Login Successful",
                "user": {
                    "_id": "6616cdd60a355b5cfb00435f",
                    "firstname": "vaibhav",
                    "lastname": "shukla",
                    "email": "vaibhav125shukla@gmail.com",
                    "password": "$2a$10$CKP/bVd.f17P2vu4yGoQ6eIobzEJzGAZ0ZjqD3moGcseFIMMhka36",
                    "createdAt": "2024-04-10T17:35:18.332Z",
                    "lastLoggedIn": "2024-04-10T17:58:14.734Z",
                    "__v": 0
                }
            };
            console.log('response:', response);
            if (typeof response !== "undefined" && typeof response.user !== "undefined") {
                await login(response.user);
                console.log('navigated');
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
                </form>
                <p id="newToBookshelf">New To Bookshelf? <button type="button" onClick={(e) => setIsSignIn(false)}>Sign Up</button></p>
            </div> : <SignUp onSignInClick={() => setIsSignIn(true)} />}
        </>
    );
}

export default SignIn;