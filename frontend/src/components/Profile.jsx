import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Header } from "./Header";
import "./Profile.css";
import axios from "axios";
import { setProfileImage } from "../store/actions/dashboardActions";
import { useDispatch } from "react-redux";

export const Profile = () => {
    const { user } = useAuth();
    const [firstname, setFirstName] = useState(user?.firstname);
    const [lastname, setLastName] = useState(user?.lastname);
    const [email, setEmail] = useState(user?.email);
    let [phone, setPhone] = useState(user?.phone);
    const [gender, setGender] = useState(user?.gender);
    const [messsage, setMessage] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    let uploadedFileName = '';

    const updateProfile = async (e) => {
        e.preventDefault();
        const fileUploadUrl = process.env.REACT_APP_SERVER_URL + 'api/uploadFile';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user._id);
        const config = {
            headers : {
                'Content-Type':'multipart/form-data'
            }
        };
        axios.post(fileUploadUrl, formData, config).then(async (response) => {
            uploadedFileName = response.data.saveAs;
            if (response.data.success === true) {
                const userData = { firstname: firstname, lastname: lastname, phone: phone, gender: gender, userId: user._id, avatarUrl: uploadedFileName};
                const headers = {
                    'Content-Type': 'application/json'
                };
                try {
                    const result = await axios.post(process.env.REACT_APP_SERVER_URL+'api/profile', userData, headers);
                    //https://book-shelf-xvxk.onrender.com
                    const response = result.data;
                    if (typeof response.success !== "undefined" && response.success === true && response.existingUser._id !== "") {
                        let profileDetails = response.existingUser;
                        setFirstName(profileDetails.firstname);
                        setLastName(profileDetails.lastname);
                        setPhone(profileDetails.phone);
                        setEmail(profileDetails.email.toLowerCase());
                        setGender(profileDetails.gender);
                        dispatch(setProfileImage(uploadedFileName));
                    }
                    setMessage(response.message);
                } catch (error) {
                    console.log('Error in profile updation:', error);
                }
            }
        });
    }

    const handleProfileImage = (e) => {
        setFile(e.target.files[0]);
    }

    const validateProfile = (event) => {
        switch (event.target.id) {
            case 'firstname':
                if (!firstname.trim()) {
                    setFirstNameError('firstname is required.');
                } else if (!(/^[a-zA-Z]{2,}$/.test(firstname.trim()))) {
                    setFirstNameError('firstname must contain only alphabets with at least two characters.');
                } else {
                    setFirstNameError('');
                }
                break;
            case 'lastname':
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
            case 'phone':
                phone = '+' + phone;
                if (!phone.trim()) {
                    setEmailError('Mobile number is required.');//^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$
                } else if (!(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/.test(phone.trim()))) {
                    setPhoneError('Please enter valid 10 digits mobile number.');
                } else {
                    setPhoneError('');
                }
                break;
        }
    }

    return <>
        <Header />
        <div id="profileDiv">
            <div className="profileContent">
                <h3>My Profile</h3>
                {messsage ? <p>{messsage}</p> : ''}
                <form onSubmit={updateProfile}>
                    <div className="contentRow">
                        <label className="contentLabel">First Name:</label>
                        <div className="contentValue">
                            <input type="text" className="capitalize" id="firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)} onKeyUp={validateProfile}/>
                            {firstNameError && <div className="errorMessage">{firstNameError}</div>}
                        </div>
                    </div>
                    <div className="contentRow">
                        <label className="contentLabel">Last Name:</label>
                        <div className="contentValue">
                            <input type="text" className="capitalize" id="lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} onKeyUp={validateProfile}/>
                            {lastNameError && <div className="errorMessage">{lastNameError}</div>}
                        </div>
                    </div>
                    <div className="contentRow">
                        <label className="contentLabel">Email:</label>
                        <div className="contentValue"><input type="text" id="email" value={email} readOnly /></div>
                    </div>
                    <div className="contentRow">
                        <label className="contentLabel">Mobile:</label>
                        <div className="contentValue">
                            <input type="text" id="phone" className="capitalize" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyUp={validateProfile}/>
                            {phoneError && <div className="errorMessage">{phoneError}</div>}
                        </div>
                    </div>
                    <div className="contentRow">
                        <label className="contentLabel">Gender:</label>
                        <div className="contentValue">
                            <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} /><label htmlFor="male">Male</label>
                            <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} /><label htmlFor="female">Female</label>
                        </div>
                    </div>
                    <div className="contentRow">
                        <label className="contentLabel">Photo:</label>
                        <div className="contentValue">
                            <input type="file" name="profile_image" id="profile_image" onChange={handleProfileImage}/>
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