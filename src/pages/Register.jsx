import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userAdded, setUserAdded] = useState(false);
  const [beforeOtp, setBeforeOtp] = useState(false);
  const otpRefs = useRef([]);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [errTimeout, setErrTimeout] = useState(null);

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
  
  const handleSkip = () => {
    setUserAdded(false);
    navigate("/login");
  }

  const handleSendOtp = async () => {
    setLoader(true);
    try {
      const resp = await axios.post(`https://podstar-1.onrender.com/api/user/account-verification-email?email=${email}`);
      setLoader(false);
      if (resp.status === 202) {
          setBeforeOtp(false);
          setOtpSent(true);
          Cookies.set("email", email);
      }
  } catch (error) {
      if (error.response && error.response.status === 409) {
          setLoader(false);
          setErr("Email Doesn't exist!");

          if (errTimeout) {
              clearTimeout(errTimeout);
          }

          const timeout = setTimeout(() => {
              setErr("");
          }, 3000);

          setErrTimeout(timeout);
      }
  }
  }

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value.length === 1 && index < otpRefs.current.length - 1) {
        otpRefs.current[index + 1].focus();
    }
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
      setErr("Sorry! Please Try Again")
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
      setUserAdded(true);
      setBeforeOtp(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setLoader(false);
        setErr(error.response.data);
      }
    }
  }

  const handleShowPassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 200);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(true);
    setTimeout(() => setShowConfirmPassword(false), 200);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const otp = otpRefs.current.map(ref => ref.value).join('');
    const em = Cookies.get('email');
    try {
        const resp = await axios.post(`https://podstar-1.onrender.com/api/user/account-verification-otp-validation?email=${em}`, { otp });
        setLoader(false);
        if (resp.status === 202 && resp.data==="Verified") {
            setOtpSent(false);
            navigate("/login")
        }else{
            setLoader(false);
            setErr('Invalid OTP!');
            if (errTimeout) {
                clearTimeout(errTimeout);
            }

            const timeout = setTimeout(() => {
                setErr('');
            }, 3000);
            setErrTimeout(timeout);
        }
    } catch (error) {
        if (error.response && error.response.status === 409) {
            setLoader(false);
            setErr('Invalid OTP!');
            if (errTimeout) {
                clearTimeout(errTimeout);
            }

            const timeout = setTimeout(() => {
                setErr('');
            }, 3000);

            setErrTimeout(timeout);
        }
    }
};

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
        <div className="container">
          <div id='content' style={{ height: "100vh", overflowY: "auto", paddingBottom: "20px" }}>
            {!userAdded && (<>
              <div className="container text-center" style={{ marginTop: "45px", marginBottom: "30px" }}>
              <div style={{ textAlign: "center" }}>
                <h1 className="heading" style={{ fontSize: "30px", margin: "10px 0", color: darkMode ? "#be1adb" : "black" }}>
                  <b>Sign Up with Podstar</b>
                </h1>
              </div>
              <div style={{ textAlign: "left" }}>
                {err && 
                  <div className="notifications-container" style={{margin:"auto"}}>
                  <div className="error-alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="error-svg">
                          <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill-rule="evenodd"></path>
                        </svg>
                      </div>
                      <div className="error-prompt-container">
                        <p className="error-prompt-heading" >{err}
                        </p><div className="error-prompt-wrap">
                          <ul className="error-prompt-list">
                            {errors.username && <li>{errors.username}</li>}
                            {errors.phone && <li>{errors.phone}</li>}
                            {errors.email && <li>{errors.email}</li>}
                            {errors.password && <li>{errors.password}</li>}
                            {errors.confirmPassword && <li>{errors.confirmPassword}</li>}
                          </ul>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>

            <div className="container text-center" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <form className="form" onSubmit={handleSubmit}>
                <div className="flex-column">
                  <label className="label">Username </label>
                </div>
                <div className="inputForm">
                  <input type="text" className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="flex-column">
                  <label className="label">First Name </label>
                </div>
                <div className="inputForm">
                  <input type="text" className="input" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="flex-column">
                  <label className="label">Last Name </label>
                </div>
                <div className="inputForm">
                  <input type="text" className="input" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="flex-column">
                  <label className="label">Phone </label>
                </div>
                <div className="inputForm">
                  <input type="text" className="input" placeholder="Phone No." value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                

                <div className="flex-column">
                  <label className="label">Email </label>
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
                  <input type="text" className="input" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                

                <div className="flex-column">
                  <label className="label">Password </label>
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
                    type={showPassword ? 'text' : 'password'}
                    className="input"
                    placeholder="Password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <svg
                    viewBox="0 0 576 512"
                    height="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleShowPassword} style={{ cursor: "pointer" }}
                  >
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                  </svg>
                </div>
                  

                <div className="flex-column">
                  <label className="label">Confirm Password </label>
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input"
                    placeholder="Confirm Password"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <svg
                    viewBox="0 0 576 512"
                    height="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleShowConfirmPassword} 
                    style={{ cursor: "pointer" }}
                  >
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                  </svg>
                </div>


                <button className="button-submit" type="submit">Sign Up</button>
                <p className="p">
                  Already have an account? <Link to="/login" className="span">Sign In</Link>
                </p>
              </form>
            </div>
            </>
            )}

          {userAdded && beforeOtp && (
            <div className="backdrop">
              <div className="card111">
                <div className="header1">
                  <div className="image1">
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinejoin="round" strokeLinecap="round"></path>
                    </svg>
                  </div>
                  <div className="content1">
                    <span className="title1">Account Verification</span>
                    <p className="message1">Would you like to go for the account verification, it'll not take more than 30s.</p>
                  </div>
                  <div className="actions1">
                    <button className="desactivate1" onClick={handleSendOtp} type="button">Send OTP</button>
                    <button className="cancel1" onClick={handleSkip} type="button">Skip</button>
                  </div>
                </div>
              </div>
            </div>
          )}

            <div className="container text-center">
              {otpSent && (
                <div className="otp-container">
                  <form className="otp-Form" onSubmit={handleOtpSubmit}>
                    <span className="mainHeading">Enter OTP</span>
                    <p className="otpSubheading">We have sent a verification code to your email</p>
                    <div className="inputContainer">
                      {[...Array(6)].map((_, index) => (
                        <input
                          key={index}
                          ref={el => otpRefs.current[index] = el}
                          required="required"
                          maxLength="1"
                          type="text"
                          className="otp-input"
                          onChange={(e) => handleOtpChange(e, index)}
                        />
                      ))}
                    </div>
                    <button className="verifyButton" type="submit">Verify</button>
                    <p className="resendNote">Didn't receive the code? <button className="resendBtn" onClick={handleSendOtp}>Resend Code</button></p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;
