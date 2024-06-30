import React, { useState, useEffect } from 'react';
import "../css/Profile.css";
import { TextField, InputAdornment, Button } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import Cookies from "js-cookie";
import axios from 'axios';
// import { EditOutlined } from '@mui/icons-material';

const Profile = ({ profileImageUrl, setProfileImageUrl }) => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            setUsername(userData.username || '');
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setPhone(userData.phone || '');
            setEmail(userData.email || '');
            setRole(userData.role || '');
            setIsEmailVerified(userData.verified || false);
        }
    }, []);

    const handleUpdate = async (event) => {
        event.preventDefault();
        setLoading(true);
        const token = Cookies.get("token");
        const data = {
            firstName,
            lastName,
            phone
        };

        try {
            const response = await axios.put('https://podstar-1.onrender.com/api/user/update', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log(response);
            if (response.status === 200) {
                setLoading(false);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setPhone(response.data.phone);
                const updatedUser = {
                    ...JSON.parse(Cookies.get("user")),
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phone: response.data.phone,
                };
                Cookies.set("user", JSON.stringify(updatedUser), {
                    sameSite: 'None',
                    secure: true,
                    expires: 1 / 24, // Set cookie expiration to 1 hour
                });
                // You might want to update the user cookie here if needed
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyEmail = () => {
        // Add your email verification logic here
        alert('Email verification initiated.');
    };

    return (
        <div id="profileContainer" className="container-xl px-4 mt-4">
            <div className="row">
                <div className="col-xl-4">
                    <div className="card132 mb-4 mb-xl-0">
                        <div className="card-body text-center" style={{ marginTop: "45px" }}>
                            {profileImageUrl ?
                                <img className="img-account-profile rounded-circle mb-2" src={profileImageUrl} alt="" />
                                :
                                <img className="img-account-profile rounded-circle mb-2" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="" />}
                            {/* <EditOutlined/> */}
                            <h2 style={{ marginTop: "10px" }}>{firstName} {lastName}</h2>
                            <p className="small font-italic mb-4">JPG or PNG no larger than 5 MB</p>
                            <button className="btn btn1" type="button" >Upload new image</button>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card132 mb-4">
                        <h3 className="card-header text-center" style={{ marginTop: "20px" }}>Account Details</h3>
                        <div className="card-body">
                            <form onSubmit={handleUpdate}>
                                <div className="mb-3">
                                    <TextField required id="inputUsername" className="form-control " label="Username" variant="filled" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={true} />
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <TextField required id="inputFirstName" className="form-control" type="text" label="First Name" variant="filled" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} />
                                    </div>
                                    <div id="inpLast" className="col-md-6">
                                        <TextField required id="inputLastName" className="form-control" type="text" label="Last Name" variant="filled" placeholder="Enter your Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
                                    </div>
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <TextField required id="inputPhone" className="form-control" type="number" label="Phone Number" variant="filled" placeholder="Enter your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
                                    </div>
                                    <div id="inpRole" className="col-md-6">
                                        <TextField id="inputRole" className="form-control" type="text" label="Access" variant="filled" placeholder="Your Accessibility" value={role} disabled />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <TextField 
                                        id="inputEmail" 
                                        className="form-control" 
                                        type="email" 
                                        label="Email" 
                                        variant="filled" 
                                        placeholder="Enter your email" 
                                        value={email} 
                                        disabled={true}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {isEmailVerified ? (
                                                        <CheckCircleOutline color="success" />
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            style={{ backgroundColor: '#ffe303', color: 'black', borderRadius:"18px" }}
                                                            onClick={handleVerifyEmail}
                                                            disabled={loading}
                                                        >
                                                            Verify
                                                        </Button>
                                                    )}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                                <button className="btn btn1" type="submit">
                                    {!loading && (<div>Save Changes</div>)}
                                    {loading && (
                                        <div className="dot-spinner" style={{ height: "100%", marginLeft: "10px" }}>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
