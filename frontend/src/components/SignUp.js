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
            const result = await axios.post('https://book-shelf-xvxk.onrender.com/api/signup', userData, headers);
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
    return (
        <>
            {<div id="signUpDiv">
                <h2>Sign Up</h2>
                <form>
                    <div>
                        <label htmlFor="">Firstname:</label>
                        <input type="text" value={firstname} onChange={(e) => setFirstName(e.target.value.trim())} required />
                    </div>
                    <div>
                        <label htmlFor="">Lastname:</label>
                        <input type="text" value={lastname} onChange={(e) => setLastName(e.target.value.trim())} required />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} required />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value.trim())} required />
                    </div>
                    <div>
                        <button type="button" id="signUp" onClick={(e) => signUp()}>Sign Up</button>
                    </div>
                    <div>By creating an account, you agree to the BookShelf Terms of Service and Privacy Policy.</div>
                    <p id="failureMessage">{messsage}</p>
                </form>
                <div id="alreadyAMember">Already a member? <button type="button" onClick={onSignInClick}>Sign In</button></div>
            </div>}
        </>
    )
}
//Object.keys(loginUser).length > 0 ? (<Dashboard user={loginUser} onClickLogoutUser={logoutUser} />) : 
export default SignUp;