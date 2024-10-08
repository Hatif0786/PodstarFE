import React, { useState, useEffect, useRef, useCallback } from 'react';
import "../css/Profile.css";
import { Tabs, Tab, Box, TextField, Button } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import Cookies from "js-cookie";
import { Country, State } from 'country-state-city';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const Profile = ({ profileImageUrl, setProfileImageUrl, setIsVerified, enqueueSnackbar }) => {
    const [tabValue, setTabValue] = useState(0);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [streetName, setStreetName] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [role, setRole] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingSec, setLoadingSec] = useState(false);
    const otpRefs = useRef([]);
    const [beforeOtp, setBeforeOtp] = useState(true);
    const [loader, setLoader] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [errors, setErrors] = useState({});
    const [errTimeout, setErrTimeout] = useState(null);
    const [err, setErr] = useState("");
    const errTimeoutRef = useRef(null);

    const handleGetAddress = useCallback(async () => {
    setLoader(true); // Start loader
    try {
        const resp = await axios.get(`https://podstar-1.onrender.com/api/address`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        },
        });

        if (resp.status === 200) {
        const { houseNo, streetName, landmark, city, state, country } = resp.data;

        // Update your states with the address details
        setHouseNo(houseNo);
        setStreetName(streetName);
        setLandmark(landmark);
        setCity(city || ''); // Default to empty string if undefined

        const allCountries = Country.getAllCountries();
        const selectedCountryObj = allCountries.find(c => c.name === country);

        if (selectedCountryObj) {
            setSelectedCountry(selectedCountryObj.isoCode); // Set ISO code
        } else {
            console.error("Country not found in list:", country);
            setSelectedCountry(''); // Handle case where country isn't found
        }

        // Find the state ISO code (if state name is provided)
        if (selectedCountryObj) {
            const countryStates = State.getStatesOfCountry(selectedCountryObj.isoCode);
            const selectedStateObj = countryStates.find(
            (st) => st.name.toLowerCase() === state.toLowerCase()
            );

            if (selectedStateObj) {
            setSelectedState(selectedStateObj.isoCode); // Set state using ISO code
            } else {
            console.error("State not found:", state);
            setSelectedState(''); // Handle case where state isn't found
            }
        }

        setErr(""); // Clear any previous error message
        }
    } catch (error) {
        // Error handling as before
        if (error.response) {
        const errorMessage = error.response.data.message;

        if (errorMessage === "Address doesn't exist for user!!!") {
            setErr("Address doesn't exist for user!!!");
        } else if (errorMessage === "User Doesn't found with this id!!") {
            setErr("User Doesn't found with this id!!");
        }
        }
    } finally {
        setLoader(false); // Stop loader

        // Clear any previous timeout
        if (errTimeoutRef.current) {
        clearTimeout(errTimeoutRef.current);
        }

        const timeout = setTimeout(() => {
        setErr("");
        }, 3000);

        errTimeoutRef.current = timeout; // Save timeout ID to ref
    }
    }, []); // No need to include errTimeout in the dependency array
    // Ensure all necessary dependencies are included
      
      useEffect(() => {
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);
      }, []);
      
      // Fetch states when country is selected
      useEffect(() => {
        if (selectedCountry) {
          const countryStates = State.getStatesOfCountry(selectedCountry);
          setStates(countryStates);
        } else {
          setStates([]);
        }
      }, [selectedCountry]);
      
    //   useEffect(() => {
    //     if (selectedState) {
    //       const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
    //       setCities(stateCities);
    //     } else {
    //       setCities([]);
    //     }
    //   }, [selectedState, selectedCountry]);
      
      // Handle country change
      const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
      };
      
      // Handle state change
      const handleStateChange = (event) => {
        setSelectedState(event.target.value);
      };
      
      // Handle city change
      const handleCityChange = (event) => {
        setCity(event.target.value);
      };
      
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
      
        // Fetch address details on component mount
        handleGetAddress();
      }, [handleGetAddress]);
      

    const validatePhone = (phone) => {
        const re = /^\d{10}$/;
        return re.test(phone);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const validationErrors = {};
        if(!validatePhone(phone)) validationErrors.phone = "Invalid phone number";
        setErrors(validationErrors);
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
                enqueueSnackbar("Profile updated successfully!", { variant: 'success' });
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
        } finally {
            setLoading(false);
        }
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

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const otp = otpRefs.current.map(ref => ref.value).join('');
        const em = Cookies.get('email');
        try {
            const resp = await axios.post(`https://podstar-1.onrender.com/api/user/account-verification-otp-validation?email=${em}`, { otp });
            setLoader(false);
            if (resp.status === 202 && resp.data==="Verified") {
                const updatedUser = {
                    ...JSON.parse(Cookies.get("user")),
                    verified:true
                };
                Cookies.set("user", JSON.stringify(updatedUser), {
                    sameSite: 'None',
                    secure: true,
                    expires: 1 / 24, // Set cookie expiration to 1 hour
                });
                Cookies.remove("email");
                setIsEmailVerified(true);
                setIsVerified(true);
                setOtpSent(false);
                setBeforeOtp(true);
                enqueueSnackbar("Account verified successfully!", { variant: 'success' });
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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfileImage = async () => {
        setLoadingSec(true);
        const file = document.getElementById('file-input').files[0];
        if (!file) {
            alert("No file selected");
            return;
        }
    
        const formData = new FormData();
        formData.append("profileImage", file);
    
        try {
            const response = await axios.put('https://podstar-1.onrender.com/api/user/update-profile-image', formData, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.status === 200) {
                setProfileImageUrl(response.data.profileImageUrl);
                const updatedUser = {
                    ...JSON.parse(Cookies.get("user")),
                    profileImageUrl: response.data.profileImageUrl,
                };
                Cookies.set("user", JSON.stringify(updatedUser), {
                    sameSite: 'None',
                    secure: true,
                    expires: 1 / 24, // Set cookie expiration to 1 hour
                });
                setLoadingSec(false);
                enqueueSnackbar("Image updated successfully!", { variant: 'success', vertical: 'top', horizontal: 'center' });
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
        }
    };

    const handleAddressUpdate = async (event) => {
        event.preventDefault(); // Prevent form submission and page reload
        // Validate that all required fields are provided and not null/empty
        if (!houseNo || !streetName || !landmark || !city || !selectedState || !selectedCountry) {
          setErr("Please fill in all required fields."); // Set error message if any field is missing
      
          // Error message timeout logic
          if (errTimeout) {
            clearTimeout(errTimeout);
          }
      
          const timeout = setTimeout(() => {
            setErr("");
          }, 3000);
      
          setErrTimeout(timeout);
          return;
        }
        setLoading(true);
        const selectedCountryObj = Country.getCountryByCode(selectedCountry); // Get country name by code
        const selectedStateObj = State.getStateByCodeAndCountry(selectedState, selectedCountry); // Get state name by code

        const countryName = selectedCountryObj ? selectedCountryObj.name : selectedCountry;
        const stateName = selectedStateObj ? selectedStateObj.name : selectedState;
      
      
        try {
          const resp = await axios.put(
            `https://podstar-1.onrender.com/api/address`, 
            {
              houseNo: parseInt(houseNo, 10),         // Pass the address details as body
              streetName,
              landmark,
              city,
              state: stateName,  // Pass the state name instead of ISO code
              country: countryName // Pass the country name instead of ISO code
            }, 
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`, // Include the token for authentication
              },
            }
          );
      
          // Handle successful response
          if (resp.status === 200) {
            setErr(""); // Clear any error message
            enqueueSnackbar("Address updated successfully!", { variant: 'success' });
            // You can handle any post-update logic here, like displaying success notifications
          }
      
        } catch (error) {
          // Handle error
          if (error.response) {
                const errorMessage = error.response.data.message;
                setErr(errorMessage || "Failed to update address.");
            }
          // Error message timeout logic
          if (errTimeout) {
            clearTimeout(errTimeout);
          }
      
          const timeout = setTimeout(() => {
            setErr("");
          }, 3000);
      
          setErrTimeout(timeout);
        }finally{
            setLoading(false);
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
            <div id="profileContainer" className="container-xl px-4 mt-4">
                <div style={{ textAlign: "left" }}>
                    {err && 
                    <div className="notifications-container" style={{}}>
                    <div className="error-alert">
                        <div className="flex">
                        <div className="flex-shrink-0">
                            <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="error-svg">
                            <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="error-prompt-container">
                            <p className="error-prompt-heading">{err}</p>
                            <div className="error-prompt-wrap">
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
                {beforeOtp && (<div className="row">
                    <div className="col-xl-4">
                        <div className="card132 mb-4 mb-xl-0">
                            <div className="card-body text-center" style={{ marginTop: "45px", position: "relative" }}>
                                <div className="img-container" onClick={() => document.getElementById('file-input').click()}>
                                    <img className="img-account-profile rounded-circle mb-2" src={profileImageUrl || "http://bootdey.com/img/Content/avatar/avatar1.png"} alt="" />
                                    <div className="overlay">
                                        <span className="upload-symbol">✏️</span>
                                    </div>
                                    <input 
                                        type="file" 
                                        id="file-input" 
                                        className="file-input" 
                                        accept="image/*" 
                                        onChange={handleImageUpload}
                                        style={{ display: "none" }}
                                    />
                                </div>
                                <h2 style={{ marginTop: "10px" }}>{firstName} {lastName}</h2>
                                <p className="small font-italic mb-4">JPG or PNG no larger than 5 MB</p>
                                <button className="btn btn1" type="button" onClick={handleUpdateProfileImage}>
                                {!loadingSec && (<div>Update Profile Image</div>)}
                                        {loadingSec && (
                                            <div className="dot-spinner" style={{ height: "95%", marginLeft: "10px" }}>
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
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8">
                        <h3 className="card-header text-center" style={{ padding: "20px", marginBottom:"20px" }}>Account Details</h3>
                        <Box sx={{ width: '100%' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" TabIndicatorProps={{
                                style: {
                                    backgroundColor: '#be1adb', // Changes the indicator color
                                },
                            }}
                            sx={{
                                '.MuiTab-root': {
                                    color: '#be1adb', // Inactive tab text color
                                },
                                '.Mui-selected': {
                                    color: '#be1adb !important', // Active tab text color
                                }
                            }}
                            >
                                <Tab label="Basic" />
                                <Tab label="Address" />
                            </Tabs>

                            {tabValue === 0 && (
                                <Box sx={{ paddingTop:'20px' }}>
                                    <div className="card132 mb-4">
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
                                                        <TextField id="inputRole" className="form-control" type="text" label="Access Rights" variant="filled" placeholder="Your Accessibility" value={role} disabled />
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
                                                        disabled={isEmailVerified}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    {isEmailVerified ? (
                                                                        <CheckCircleOutline color="success" />
                                                                    ) : (
                                                                        <Button
                                                                            variant="contained"
                                                                            style={{ backgroundColor: '#ffe303', color: 'black', borderRadius:"18px" }}
                                                                            onClick={handleSendOtp}
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
                                                        <div className="dot-spinner" style={{ height: "95%", marginLeft: "10px" }}>
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
                                </Box>
                            )}
                            {tabValue === 1 && (
                                <Box sx={{ paddingTop:'20px' }}>
                                    <div className="card132 mb-4">
                                        <div className="card-body">
                                            <form onSubmit={handleAddressUpdate}>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6">
                                                        <TextField required id="inputHouseNo" className="form-control" type="text" label="House No." variant="filled" placeholder="Enter your House No." value={houseNo} onChange={(e) => setHouseNo(e.target.value)}/>
                                                    </div>
                                                    <div id="inpLast" className="col-md-6">
                                                        <TextField required id="inputStreetName" className="form-control" type="text" label="Street Name" variant="filled" placeholder="Enter your Street name" value={streetName} onChange={(e) => setStreetName(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <TextField required id="inputLandmark" className="form-control " label="Landmark" variant="filled" placeholder="Enter your Landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)}/>
                                                </div>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6">
                                                    <TextField 
                                                        required 
                                                        id="inputCity" 
                                                        className="form-control" 
                                                        type="text" 
                                                        label="City" 
                                                        variant="filled" 
                                                        placeholder="Enter your City" 
                                                        value={city} 
                                                        onChange={handleCityChange} 
                                                    />
                                                    </div>
                                                    <div id="inpRole" className="col-md-6">
                                                        <FormControl variant="standard" sx={{ m: 1}} fullWidth>
                                                            <InputLabel id="state-select-label">State</InputLabel>
                                                            <Select
                                                            labelId="state-select-label"
                                                            id="state-select"
                                                            value={selectedState}
                                                            onChange={handleStateChange}
                                                            label="State"
                                                            disabled={!selectedCountry} // Disable if no country is selected
                                                            >
                                                            <MenuItem value="">
                                                                <em>None</em>
                                                            </MenuItem>
                                                            {states.map((state) => (
                                                                <MenuItem key={state.isoCode} value={state.isoCode}>
                                                                {state.name}
                                                                </MenuItem>
                                                            ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <FormControl variant="standard" sx={{ m: 1}} fullWidth>
                                                        <InputLabel id="country-select-label">Country</InputLabel>
                                                        <Select
                                                        labelId="country-select-label"
                                                        id="country-select"
                                                        value={selectedCountry}
                                                        onChange={handleCountryChange}
                                                        label="Country"
                                                        >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        {countries.map((country) => (
                                                            <MenuItem key={country.isoCode} value={country.isoCode}>
                                                            {country.name}
                                                            </MenuItem>
                                                        ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>    
                                                <button className="btn btn1" type="submit">
                                                    {!loading && (<div>Update Address</div>)}
                                                    {loading && (
                                                        <div className="dot-spinner" style={{ height: "95%", marginLeft: "10px" }}>
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
                                </Box>
                            )}
                        </Box>
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
        )}
        </>
    );
};

export default Profile;
