import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/login.css";


const Register = ({darkMode}) => {
  const [loader, setLoader] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,12}$/;
    return re.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const validationErrors = {};
    if (!username) validationErrors.username = "Username is required";
    if ((username !== '' && username === firstName) || (username !== '' && username === lastName)) validationErrors.username = "Username should not be the same as first name or last name";
    if (!email) validationErrors.email = "Email is required";
    else if (!validateEmail(email)) validationErrors.email = "Invalid email format";
    if (!phone) validationErrors.phone = "Phone number is required";
    else if (!validatePhone(phone)) validationErrors.phone = "Invalid phone number";
    if (!password) validationErrors.password = "Password is required";
    else if (!validatePassword(password)) validationErrors.password = "Password must be 8-12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character";
    if (!confirmPassword) validationErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoader(false);
      return;
    }

    const user = {
      username,
      firstName,
      lastName,
      phone,
      email,
      password,
      confirmPassword
    };

    try {
      await axios.post('https://podstar-1.onrender.com/api/user/add', user);
      setLoader(false);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setLoader(false);
        setErr(error.response.data);
      }
    }
  }

  return (
    <>
      {loader && (
        <section className="dots-container" style={{ marginLeft: "1%", marginTop: "6%" }}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      )}

      {!loader && (
        <div id='content' style={{ height: "100vh", overflowY: "auto", paddingBottom: "20px" }}>
          <div className="container text-center" style={{ marginTop: "70px", marginBottom: "30px" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="heading" style={{ fontSize: "30px", margin: "10px 0", color: darkMode ? "#be1adb" : "black" }}>
                <b>Sign Up with Podstar</b>
              </h1>
            </div>
            <div style={{ textAlign: "center" }}>
              {err && 
                <div className="container" style={{ paddingLeft: "1.5%" }}>
                  <h4 style={{ color: "red", margin: "25px" }}><b>{err}</b></h4>
                </div>
              }
            </div>
          </div>

          <div className="container text-center" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <form className="form" onSubmit={handleSubmit}>
              <div className="flex-column">
                <label>Username </label>
              </div>
              <div className="inputForm">
                <input type="text" className="input" placeholder="Enter your Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              {errors.username && <span className="error">{errors.username}</span>}

              <div className="flex-column">
                <label>First Name </label>
              </div>
              <div className="inputForm">
                <input type="text" className="input" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>

              <div className="flex-column">
                <label>Last Name </label>
              </div>
              <div className="inputForm">
                <input type="text" className="input" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>

              <div className="flex-column">
                <label>Phone </label>
              </div>
              <div className="inputForm">
                <input type="text" className="input" placeholder="Enter your phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              {errors.phone && <span className="error">{errors.phone}</span>}

              <div className="flex-column">
                <label>Email </label>
              </div>
              <div className="inputForm">
                <svg
                  height="20"
                  viewBox="0 0 32 32"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Layer_3" data-name="Layer 3">
                    <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                  </g>
                </svg>
                <input type="text" className="input" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
              {errors.email && <span className="error">{errors.email}</span>}

              <div className="flex-column">
                <label>Password </label>
              </div>
              <div className="inputForm">
                <svg
                  height="20"
                  viewBox="-64 0 512 512"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                  <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
                </svg>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter your Password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
                <svg
                  viewBox="0 0 576 512"
                  height="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                </svg>
              </div>
                {errors.password && <span className="error">{errors.password}</span>}

              <div className="flex-column">
                <label>Confirm Password </label>
              </div>
              <div className="inputForm">
                <svg
                  height="20"
                  viewBox="-64 0 512 512"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                  <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
                </svg>
                <input
                  type="password"
                  className="input"
                  placeholder="Please confirm your Password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <svg
                  viewBox="0 0 576 512"
                  height="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                </svg>
              </div>
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}


              <button className="button-submit" type="submit">Sign Up</button>
              <p className="p">
                Already have an account? <Link to="/login" className="span">Sign In</Link>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;
