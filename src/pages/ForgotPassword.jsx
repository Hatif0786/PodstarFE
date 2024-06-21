import React, { useState, useRef } from 'react';
import axios from "axios";
import "../css/login.css";
import Cookies from "js-cookie";
import "../css/ForgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ darkMode }) => {
    const [loader, setLoader] = useState(false);
    const [err, setErr] = useState("");
    const [errTimeout, setErrTimeout] = useState(null);
    const navigate = useNavigate();
    const [beforeOtp, setBeforeOtp] = useState(true);
    const [otpSent, setOtpSent] = useState(false);
    const [afterOtp, setAfterOtp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const otpRefs = useRef([]);

    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const validationErrors = {};
        if (!email) validationErrors.email = "Email is required";
        else if (!validateEmail(email)) validationErrors.email = "Invalid email format";

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setErr("Sorry! Please Try Again")
            setLoader(false);
            return;
        }

        try {
            const resp = await axios.post(`https://podstar-1.onrender.com/api/user/forgot-password-email?email=${email}`);
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
    };

    const handleShowPassword = () => {
        setShowPassword(true);
        setTimeout(() => setShowPassword(false), 200);
      };

    const handleOtpChange = (e, index) => {
        const { value } = e.target;
        if (value.length === 1 && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        if (!Cookies.get("verified")) {
            setBeforeOtp(true);
            setAfterOtp(false);
            navigate("/forgot-password")
            return;
        }else if(Cookies.get("verified")==="yes"){
            const validationErrors = {};
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

            const passwordDto = {
                password: password,
                confirmPassword: confirmPassword
            }
            try {
                const resp = await axios.put(`https://podstar-1.onrender.com/api/user/update-password?email=${email}`, passwordDto);
                setLoader(false);
                if (resp.status === 200) {
                    navigate("/login");
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    setLoader(false);
                    setErr("User Doesn't found!");
                    if (errTimeout) {
                        clearTimeout(errTimeout);
                    }
    
                    const timeout = setTimeout(() => {
                        setErr('');
                    }, 3000);
    
                    setErrTimeout(timeout);
                }
            }    
        }
    }

    const validatePassword = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,12}$/;
        return re.test(password);
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
                setAfterOtp(true);
                Cookies.remove("email");
                const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
                Cookies.set("verified", "yes", { expires });
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
                <section
                    className="dots-container"
                    style={{ marginLeft: "1%", marginTop: "6%" }}
                >
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </section>
            )}

            {!loader && (
                <div style={{ height: "100vh", overflowY: "auto", paddingBottom: "20px" }}>
                    <div className="container text-center" style={{ marginTop: "45px", marginBottom: "30px" }}>
                        <div style={{ textAlign: "center" }}>
                            <h1 className="heading" style={{ fontSize: "30px", margin: "10px 0", color: darkMode ? "#be1adb" : "black" }}><b>Reset Password</b></h1>
                        </div>
                        <div style={{ textAlign: "center" }}>
                        {err &&
                            <div className="notifications-container">
                                <div className="error-alert">
                                <div className="flex">
                                    {/* <div className="flex-shrink-0">
                                    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="error-svg">
                                        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 001.414 1.414L10 11.414l1.293 1.293a1 1 001.414-1.414L11.414 10l1.293-1.293a1 1 00-1.414-1.414L10 8.586 8.707 7.293z" fillRule="evenodd"></path>
                                    </svg>
                                    </div> */}
                                    <div className="error-prompt-container">
                                    <p className="error-prompt-heading">{err}</p>
                                    <div className="error-prompt-wrap">
                                        <ul className="error-prompt-list">
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
                    <div
                        className="container text-center"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {beforeOtp && (
                            <form className="form" onSubmit={handleEmailSubmit}>
                                <h3 id='heading'>Email Verification</h3>
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
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button className="button-submit">Send OTP</button>
                            </form>
                        )}

                        {otpSent && (
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
                                            type="number"
                                            className="otp-input"
                                            onChange={(e) => handleOtpChange(e, index)}
                                        />
                                    ))}
                                </div>
                                <button className="verifyButton" type="submit">Verify</button>
                                <p className="resendNote">Didn't receive the code? <button className="resendBtn" onClick={handleEmailSubmit}>Resend Code</button></p>
                            </form>
                        )}


                        {afterOtp && (
                            <form className="form" onSubmit={handlePasswordSubmit}>
                                
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
                                    placeholder="New Password"
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
                                    placeholder="Confirm New Password"
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                <button className="button-submit">Reset Password</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default ForgotPassword;
