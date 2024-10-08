import React, {useRef} from "react";
import "../css/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from 'react-facebook-login';

const Login = ({darkMode, setMenuOpen, profileImageUrl, setUserlogged, onLogin, setProfileImageUrl}) => {
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const facebookRef = useRef(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    // Create user object with form data
    const user = {
      "username":username,
      "password":password
    };
    try{
        const resp = await axios.post('https://podstar-1.onrender.com/api/user/signin', user);
        setLoader(false);
        if ((resp.status === 200 && resp.data.user.role==="ADMIN") || (resp.status === 200 && resp.data.user.role==="NORMAL")) {
          //localStorage.setItem("user", JSON.stringify(resp.data.user));
          //localStorage.setItem("token", resp.data.token);
          const userString = JSON.stringify(resp.data.user); 
          // Debugging line
          Cookies.set("user", userString, {
            sameSite: 'None',
            secure: true,
            expires: 1 / 24, // Set cookie expiration to 1 hour
          });
          Cookies.set("token", resp.data.token, {
            sameSite: 'None',
            secure: true,
            expires: 1 / 24, // Set cookie expiration to 1 hour
          });
          setUserlogged(true);
          onLogin();
          setProfileImageUrl(resp.data.user.profileImageUrl);
          navigate("/dashboard");
        }
      }catch (error) {
        if (error.response && error.response.status === 409) {
          setLoader(false);
          setErr("Bad Credentials, Try Again!!");
        }
      }
  }

  const handleShowPassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 200);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
  
      // Extract access token from response
      const accessToken = tokenResponse.access_token;
      setLoader(true);
      try {
        // Fetch user profile using access token
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const userData = await response.json();

        const user = {
          "firstName":userData.given_name,
          "lastName":userData.family_name,
          "email":userData.email,
          "profileImageUrl":userData.picture
        };
        try{
          const resp = await axios.post('https://podstar-1.onrender.com/api/user/signin-google', user);
          setLoader(false);
          if ((resp.status === 200 && resp.data.user.role==="ADMIN") || (resp.status === 200 && resp.data.user.role==="NORMAL")) {
            //localStorage.setItem("user", JSON.stringify(resp.data.user));
            //localStorage.setItem("token", resp.data.token);
            const userString = JSON.stringify(resp.data.user); 
            // Debugging line
            Cookies.set("user", userString, {
              sameSite: 'None',
              secure: true,
              expires: 1 / 24, // Set cookie expiration to 1 hour
            });
            Cookies.set("token", resp.data.token, {
              sameSite: 'None',
              secure: true,
              expires: 1 / 24, // Set cookie expiration to 1 hour
            });
            setUserlogged(true);
            onLogin();
            setProfileImageUrl(resp.data.user.profileImageUrl);
            navigate("/dashboard");
          }
        }catch (error) {
          if (error.response && error.response.status === 409) {
            setLoader(false);
            setErr("Bad Credentials, Try Again!!");
          }else if(error.response && error.response.status === 401){
            setLoader(false);
            setErr("User Already Exists, Please try with credentials!!");
          }
        }
        // Now you can use userData which contains information like email, name, etc.
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Error: ", errorResponse);
    },
  });


  const responseFacebook = async (response) => {
    setLoader(true);
    const user = {
      "name":response.name,
      "email":response.email,
      "profileImageUrl":response.picture.data.url
    };
    try{
      const resp = await axios.post('https://podstar-1.onrender.com/api/user/signin-facebook', user);
      setLoader(false);
      if ((resp.status === 200 && resp.data.user.role==="ADMIN") || (resp.status === 200 && resp.data.user.role==="NORMAL")) {
        //localStorage.setItem("user", JSON.stringify(resp.data.user));
        //localStorage.setItem("token", resp.data.token);
        const userString = JSON.stringify(resp.data.user); 
        // Debugging line
        Cookies.set("user", userString, {
          sameSite: 'None',
          secure: true,
          expires: 1 / 24, // Set cookie expiration to 1 hour
        });
        Cookies.set("token", resp.data.token, {
          sameSite: 'None',
          secure: true,
          expires: 1 / 24, // Set cookie expiration to 1 hour
        });
        setUserlogged(true);
        onLogin();
        setProfileImageUrl(resp.data.user.profileImageUrl);
        navigate("/dashboard");
      }
    }catch (error) {
      if (error.response && error.response.status === 409) {
        setLoader(false);
        setErr("Bad Credentials, Try Again!!");
      }else if(error.response && error.response.status === 401){
        setLoader(false);
        setErr("User Already Exists, Please try with credentials!!");
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
        <div id="content" style={{ height: "100vh", overflowY: "auto", paddingBottom: "20px" }}>
          <div className="container text-center" style={{ marginTop: "45px", marginBottom: "30px"}}>
              <div style={{ textAlign: "center" }}>
                <h1 className="heading" style={{ fontSize: "30px", margin: "10px 0", color: darkMode ? "#be1adb" : "black"}}><b>Sign In with Podstar</b></h1>
              </div>
              <div style={{ textAlign: "center" }}>
                {err && 
                  <div className="notifications-container" style={{
                  margin: 'auto'}}>
                  <div className="error-alert">
                    <div className="flex" style={{paddingLeft:"35px"}}>
                      <div className="flex-shrink-0">
                        
                        <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="error-svg">
                          <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill-rule="evenodd"></path>
                        </svg>
                      </div>
                      <div className="error-prompt-container">
                        <p className="error-prompt-heading text-center">{err}
                        </p>
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
            <form className="form" onSubmit={handleSubmit}>
              <div className="flex-column">
                <label>Username </label>
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
                <input
                  type="text"
                  className="input"
                  placeholder="Enter your username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="flex-column">
                <label>Password </label>
              </div>
              <div className="inputForm">
                <svg
                  height="20"
                  viewBox="-64 0 512 512"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ cursor: "pointer" }}
                >
                  <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                  <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your Password"
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

              <div className="flex-row">
                <div>
                  <input type="checkbox" />
                  <label style={{marginLeft:"2px"}}>Remember me </label>
                </div>
                <Link to="/forgot-password" className="span">Forgot password?</Link>
              </div>
              <button className="button-submit">Sign In</button>
              <p className="p">
                Don't have an account?{" "}
                <Link to="/signup"  className="span">
                  Sign Up
                </Link>
              </p>
              <p className="p line">Or With</p>

              <div className="flex-row">
              <button className="btn google" type="button" onClick={() => googleLogin()}>
                  <svg
                    version="1.1"
                    width="20"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 512 512"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                  >
                    <path
                      style={{ fill: "#FBBB00" }}
                      d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
      c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
      C103.821,274.792,107.225,292.797,113.47,309.408z"
                    ></path>
                    <path
                      style={{ fill: "#518EF8" }}
                      d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
      c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
      c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                    ></path>
                    <path
                      style={{ fill: "#28B446" }}
                      d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
      c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
      c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                    ></path>
                    <path
                      style={{ fill: "#F14336" }}
                      d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
      c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
      C318.115,0,375.068,22.126,419.404,58.936z"
                    ></path>
                  </svg>
                  Google
                </button>
                <FacebookLogin
                  appId="803928975188833"
                  autoLoad={false}
                  textButton="Facebook"
                  fields="name,email,picture"
                  callback={responseFacebook}
                  cssClass="btn facebook"
                  icon={<svg
                    version="1.1"
                    height="20"
                    width="20"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 24 24"
                    style={{ enableBackground: "new 0 0 24 24" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M22.675,0H1.325C0.592,0,0,0.592,0,1.325v21.351C0,23.408,0.592,24,1.325,24h11.495v-9.294H9.364v-3.622h3.456V8.629c0-3.42,2.091-5.276,5.15-5.276c1.464,0,2.717,0.109,3.079,0.159v3.564l-2.112,0.001c-1.652,0-1.97,0.785-1.97,1.94v2.544h3.944l-0.515,3.622h-3.429V24h6.488c0.733,0,1.325-0.592,1.325-1.325V1.325C24,0.592,23.408,0,22.675,0z"
                        fill="#1877F2" // Blue color
                      />
                    </g>
                  </svg>}
                  ref={facebookRef}
                />


                {/* <button className="btn apple" type="button" onClick={handleAppleClick}>
                  <svg
                    version="1.1"
                    height="20"
                    width="20"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 22.773 22.773"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                  >
                    {" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"></path>{" "}
                        <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"></path>{" "}
                      </g>
                    </g>
                  </svg>
                  Apple
                </button> */}
              </div>
            </form>{" "}
          </div>
        </div>
      )} 
    </>
  );
  
};

export default Login;
