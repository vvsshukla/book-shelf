import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Header } from "./Header";
import "./Profile.css";
import axios from "axios";

export const Profile = () => {
    console.log('Hi...');
    const { user } = useAuth();
    console.log('user:', user);
    const [firstname, setFirstName] = useState(user?.firstname);
    const [lastname, setLastName] = useState(user?.lastname);
    const [email, setEmail] = useState(user?.email);
    const [phone, setPhone] = useState(user?.phone);
    const [gender, setGender] = useState(user?.gender);
    const [messsage, setMessage] = useState('');

    const updateProfile = async (e) => {
        e.preventDefault();
        const userData = { firstname: firstname, lastname: lastname, phone: phone, gender: gender, userId: user._id};
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const result = await axios.post('http://localhost:5000/api/profile', userData, headers);
            //https://book-shelf-xvxk.onrender.com
            const response = result.data;
            if (typeof response.success !== "undefined" && response.success === true && response.existingUser._id!=="") {
                let profileDetails = response.existingUser;
                setFirstName(profileDetails.firstname);
                setLastName(profileDetails.lastname);
                setPhone(profileDetails.phone);
                setEmail(profileDetails.email.toLowerCase());
                setGender(profileDetails.gender);
            }
            setMessage(response.message);
        } catch (error) {
            console.log('Error in profile updation:', error);
        }
    }

    // const fetchProfile = async () => {
    //     const userData = { userId: user._id };
    //     const headers = {
    //         'Content-Type': 'application/json'
    //     };
    //     try {
    //         const result = await axios.post('http://localhost:5000/api/getProfile', userData, headers);//https://book-shelf-xvxk.onrender.com
    //         console.log('result:', result);
    //         const response = result.data;
    //         console.log('response:', response);
    //         // if (typeof response.success !== "undefined" && response.success === true) {
    //         //     await login(response.user);
    //         //     console.log('navigated');
    //         // } else {
    //         //     console.log('message:', response.message);
    //         //     setMessage(response.message);
    //         // }
    //         // document.getElementById('signIn').innerText = 'Sign In';
    //     } catch (error) {
    //         console.log('Error in fetchProfile:', error);
    //     }
    // }

    // useEffect(() => {
    //     fetchProfile();
    // }, []);

    return <>
                <Header />
                <div id="profileDiv">
                    <div className="profileContent">
                        <h3>My Profile</h3>
                        {messsage ? <p>{messsage}</p> : ''}
                        <form onSubmit={updateProfile}>
                            <div className="contentRow">
                                <label className="contentLabel">First Name:</label>
                                <div className="contentValue"><input type="text" className="capitalize" value={firstname} onChange={(e) => setFirstName(e.target.value)} /></div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Last Name:</label>
                                <div className="contentValue"><input type="text" className="capitalize" value={lastname} onChange={(e) => setLastName(e.target.value)} /></div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Email:</label>
                                <div className="contentValue"><input type="text" value={email} readOnly /></div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Phone:</label>
                                <div className="contentValue"><input type="text" className="capitalize" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Gender:</label>
                                <div className="contentValue">
                                    <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} /><label htmlFor="male">Male</label>
                                    <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} /><label htmlFor="female">Female</label>
                                </div>
                            </div>
                            <div className="contentRow profileButton">
                                <button type="submit">Update Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
           </>;
}