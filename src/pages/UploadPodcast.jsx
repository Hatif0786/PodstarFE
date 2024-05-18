import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/uploadPodcast.css";
import Cookies from "js-cookie";

const UploadPodcast = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const responseData = location.state && location.state.responseData;
  const [loader, setLoader] = useState(false);
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("No selected file");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailId, setThumbnailId] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleThumbnail = async (event) => {
    event.preventDefault();
    setLoader(true);
    const formData = new FormData();
    formData.append("album", file);
    try{
      const resp = await axios
        .post(`http://localhost:5000/api/album/upload-thumbnail/${responseData.id}`, formData, {
          headers: {
            //"Authorization": `Bearer ${localStorage.getItem("token")}`, // Retrieve token from localStorage
            "Authorization": `Bearer ${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        })
        setLoader(false);
        setThumbnailUrl(resp.data.thumbnailUrl)
        setThumbnailId(resp.data.thumbnailId);
        navigate("/upload-podcast", { state: { responseData: resp.data } });
      }catch (error) {
        if (error.response && error.response.status === 400) {
          setLoader(false);
          setErr(error.response.data);
        }
      }
      
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoader(true);
        const response = await axios.get('http://localhost:5000/api/album/categories', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        });
        setCategories(response.data); // Assuming response.data is an array of categories
        setLoader(false);
      } catch (error) {
        setLoader(false);
        setErr(error.message);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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
        <section className="section_form">
          <div className="container text-center" style={{ marginTop: "70px", marginBottom: "30px" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="heading" style={{ fontSize: "30px", margin: "10px 0", color: darkMode ? "#be1adb" : "black" }}>
                <b>Add the Podcast details</b>
              </h1>
            </div>
            <div style={{ textAlign: "center" }}>
              {err && (
                <div className="container" style={{ paddingLeft: "1.5%" }}>
                  <h1 style={{ color: "red", margin: "25px" }}><b>{err}</b></h1>
                </div>
              )}
            </div>
          </div>
          <div className="container text-center" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <form className="feed-form">
              <select
                required
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{ borderRadius: "30px", border: "2.5px solid #be1adb", height:"45px", marginBottom:"18px", paddingRight:"10px", paddingLeft:"10px" }}
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              { !thumbnailId && !thumbnailUrl && (<div className="containert" style={{marginBottom:"18px"}}> 
                <div className="header"> 
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                    <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> <p>Browse File to upload!</p>
                </div> 
                <label for="file" className="footer"> 
                  <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></g></svg> 
                  <p>{fileName}</p> 
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000000" stroke-width="2"></path> <path d="M19.5 5H4.5" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" stroke-width="2"></path> </g></svg>
                </label> 
                <input id="file" type="file" onChange={handleFileChange}/> 
                {file && (
                  <button className="button_submit" onClick={handleThumbnail}
                  style={{
                    color: darkMode ? "black" : "#be1adb",
                    height:"35px",
                    marginBottom:"5px",
                    marginTop:"5px",
                    fontWeight: "5px",
                    borderRadius: "30px",
                    backgroundColor: darkMode ? "#be1adb" : "black"
                  }}
                >
                  Save Thumbnail
                </button>
                )}
              </div>
              )}
              {thumbnailId && thumbnailUrl && (
                <>
                <input type="text" className="input" placeholder="Enter your thumbnail Url" style={{ borderRadius: "30px", border: "2.5px solid #be1adb", height:"45px", marginBottom:"18px", paddingRight:"10px", paddingLeft:"10px", width:"95%" }} value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} disabled/>
                <input type="text" className="input" placeholder="Enter your thumbnail Id" style={{ borderRadius: "30px", border: "2.5px solid #be1adb", height:"45px", marginBottom:"18px", paddingRight:"10px", paddingLeft:"10px", width:"95%" }} value={thumbnailId} onChange={(e) => setThumbnailId(e.target.value)} disabled/>
                </>
              )}
              <button
                className="button_submit"
                style={{
                  color: darkMode ? "black" : "#be1adb",
                  fontWeight: "5px",
                  borderRadius: "30px",
                  backgroundColor: darkMode ? "#be1adb" : "black"
                }}
              >
                Save Details
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

export default UploadPodcast;
