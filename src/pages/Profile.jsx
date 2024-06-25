import React, {useState, useEffect} from 'react'
import "../css/Profile.css"
import { TextField } from '@mui/material'
import Cookies from "js-cookie";

const Profile = ({profileImageUrl, setProfileImageUrl}) => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState("");

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
        }
      }, []);

    return (
        <div id="profileContainer" className="container-xl px-4 mt-4">
        <div className="row">
            <div className="col-xl-4">
                
                <div className="card132 mb-4 mb-xl-0">
                    <div className="card-body text-center" style={{marginTop:"45px"}}>
                        
                        {profileImageUrl ?
                        <img className="img-account-profile rounded-circle mb-2" src={profileImageUrl} alt=""/>
                        :
                        <img className="img-account-profile rounded-circle mb-2" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt=""/>}
                        <h2 style={{marginTop:"10px"}}>{firstName} {lastName}</h2>
                        <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                        <button className="btn btn1"  type="button">Upload new image</button>
                    </div>
                </div>
            </div>
            <div className="col-xl-8">
                
                <div className="card132 mb-4">
                    <h3 className="card-header text-center" style={{marginTop:"20px"}}>Account Details</h3>
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <TextField id="inputUsername" className="form-control"  label="Username" variant="outlined" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="row gx-3 mb-3">
                                
                                <div className="col-md-6">
                                    <TextField id="inputFirstName" className="form-control" type="text" label="First Name" variant="outlined" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                                </div>
                                
                                <div id="inpLast" className="col-md-6">
                                    <TextField id="inputLastName" className="form-control" type="text" label="Last Name" variant="outlined" placeholder="Enter your Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                            <div className="row gx-3 mb-3">
                                
                                <div className="col-md-6">
                                    <TextField id="inputPhone" className="form-control" type="number" label="Phone Number" variant="outlined" placeholder="Enter your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                
                                <div id="inpRole" className="col-md-6">
                                    <TextField id="inputRole" className="form-control" type="text" label="Access" variant="outlined" placeholder="Your Accessibility" value={role} disabled />
                                </div>
                            </div>
                            
                            <div className="mb-3">
                            <TextField id="inputEmail" className="form-control" type="email" label="Email" variant="outlined" placeholder="Enter your email" value={email} disabled/>
                            </div>
                            <button className="btn btn1" type="button">Save changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
    }

export default Profile