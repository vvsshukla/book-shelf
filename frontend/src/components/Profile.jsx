import React, {useState} from "react";
import { useAuth } from "../hooks/useAuth";
import { Header } from "./Header";
import "./Profile.css";
import axios from "axios";

export const Profile = () => {
    const { user } = useAuth();
    const [firstname, setFirstName] = useState(user?.firstname);
    const [lastname, setLastName] = useState(user?.lastname);
    const [email, setEmail] = useState(user?.email);
    const [phone, setPhone] = useState(user?.phone);
    const [gender, setGender] = useState(user?.gender);
    const [messsage, setMessage] = useState('');
    console.log('user:', user);

    const updateProfile = async (e) => {
        e.preventDefault();
        const userData = { firstname, lastname, phone, gender };
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const result = await axios.post('http://localhost:5000/api/profile', userData, headers);//https://book-shelf-xvxk.onrender.com
            console.log('result:', result);
            const response = result.data;
            console.log('response:', response);
            if (typeof response.success !== "undefined" && response.success === true) {
            } else {
                console.log('message:', response.message);
                setMessage(response.message);
            }
            document.getElementById('signIn').innerText = 'Sign In';
        } catch (error) {
            console.log('Error while login:', error);
        }
    }

    return <>
        <Header />
        <div id="profileDiv">
            <div className="content">
                <form onSubmit={updateProfile}>
                    <div className="contentRow">
                        <div className="contentLabel">First Name:</div>
                        <div className="contentValue capitalize"><input type="text" value={firstname} onChange={(e) => setFirstName(e.target.value)} /></div>
                    </div>
                    <div className="contentRow">
                        <div className="contentLabel">Last Name:</div>
                        <div className="contentValue capitalize"><input type="text" value={lastname} onChange={(e) => setLastName(e.target.value)} /></div>
                    </div>
                    <div className="contentRow">
                        <div className="contentLabel">Email:</div>
                        <div className="contentValue capitalize"><input type="text" value={email} readOnly/></div>
                    </div>
                    <div className="contentRow">
                        <div className="contentLabel">Phone:</div>
                        <div className="contentValue"><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}/></div>
                    </div>
                    <div className="contentRow">
                        <div className="contentLabel">Gender:</div>
                        <div className="contentValue">
                            <input type="radio" name="gender" value="male" checked={gender === 'male'} onClick={(e) => setGender(e.target.value)}/><label for="male">Male</label>
                            <input type="radio" name="gender" value="female" checked={gender === 'female'} onClick={(e) => setGender(e.target.value)} /><label for="female">Female</label>
                        </div>
                    </div>
                    <div className="contentRow">
                        <button type="submit">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    </>
}