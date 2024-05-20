import React, { useState } from "react";
import axios from "axios";
import "../css/uploadPodcastAudio.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const UploadPodcastAudio = ({menuOpened, setUserlogged, logout}) => {
  const [file, setFile] = useState("");
  const [loader, setLoader] = useState(false);
  const [fileName, setFileName] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    setLoader(true);
    if(!Cookies.get("token")){
      logout()
      setUserlogged(false);
      navigate("/login");
      return;
    }
    const formData = new FormData();
    formData.append("album", file);
    try{
      const resp = await axios
        .post("http://localhost:5000/api/album/upload", formData, {
          headers: {
            // "Authorization": `Bearer ${localStorage.getItem("token")}`, // Retrieve token from localStorage
            "Authorization": `Bearer ${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        })
        setLoader(false);
        navigate("/upload-podcast", { state: { responseData: resp.data } });
      }catch (error) {
        if (error.response && error.response.status === 400) {
          setLoader(false);
          setErr(error.response.data);
        }
      }
      
  };

  return (
    <>
      {loader && (
        <section
          className="dots-container"
          style={{ marginLeft: "1%", marginTop: "20%" }}
        >
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      )}

      {!loader && (
        <>
        <div
          style={{
            display: "inline-block",
            verticalAlign: "top",
            justifyContent: "center",
            marginLeft: "40%",
            marginTop: "8%",
          }}
        >

          {err && 
            <div className="container" style={{}}>
              <h1 style={{ color: "red", margin: "25px" }}><b>{err}</b></h1>
            </div>
          }
            <form className="file-upload-form" style={{marginRight: "300px"}}>
              <label htmlFor="file" className="file-upload-label">
                <div
                  className="file-upload-design"
                  style={{ paddingLeft: "110px", paddingRight: "110px" }}
                >
                  <svg viewBox="0 0 640 512" height="1em">
                    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
                  </svg>
                  <p>Drag and Drop</p>
                  <p>or</p>
                  <span className="browse-button">Browse file</span>
                </div>
                <input id="file" type="file" onChange={handleFileChange} />
              </label>
            </form>
          </div>

          {file && (
            <div style={{ }}>
              <div className="container" style={{textAlign: "center"}}>
                <h3 style={{ color: "#be1adb", margin: "25px 25px 25px 0px" }}>{fileName}</h3>
              </div>

              <button
                className="button"
                onClick={handleFileUpload}
                style={{ marginBottom: "20%" }}
              >
                <svg className="svgIcon" viewBox="0 0 384 512">
                  <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
                </svg>
              </button>
            </div>
          )}
        </>
        )}
    </>
  );
};

export default UploadPodcastAudio;
