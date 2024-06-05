import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from 'axios';
import '../css/Search.css';
import { MusicPlayerContext } from "../App"; // Create a CSS file for custom styles

const Search = ({ setPlayerVisible, logout, setUserlogged, setMenuOpened, darkMode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const { handlePlay } = useContext(MusicPlayerContext);

  // Function to fetch search results
  const fetchSearchResults = async (searchQuery) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }

    if (!searchQuery) {
      setResults([]);
      return;
    }
    try {
      const response = await axios.get(`https://podstar-1.onrender.com/api/album/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = response.data;

      // Fetch and set audio duration for each item
      const dataWithDurations = await Promise.all(data.map(async (item) => {
        const duration = await getAudioDuration(item.albumUrl); // Adjust this to your actual audio URL property
        return { ...item, duration };
      }));

      setResults(dataWithDurations);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  // UseEffect to handle the search on query change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults(query);
    }, 500); // Adding a delay to debounce the search input

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const getAudioDuration = (url) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
      });
    });
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  const handleCardClick = useCallback((item) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }
    handlePlay(item);
  }, [logout, setMenuOpened, setUserlogged, navigate, handlePlay]);

  return (
    <div id="content"
          style={{ overflowY: "auto", height: "100vh", marginBottom: "50px" }}
        >
    <div className="search-container">
      <div className="search-header">
        <h1 className="heading" style={{ color: darkMode ? "#be1adb" : "black" }}>
          <b>Quick Search</b>
        </h1>
      </div>
      <input
        type="text"
        placeholder="Search for a podcast"
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="search-results">
        <div className="row" style={{ marginTop: "2.5%" }}>
          {results.map((item, index) => (
            <div key={index} className="col-sm-3">
              <div
                className="card"
                style={{ marginLeft: "10px", marginRight:"10px", marginBottom: "20px" }}
                onClick={() => handleCardClick(item)}
              >
                <div
                  className="card__view"
                  style={{
                    backgroundImage: `url(${item.thumbnailUrl})`,
                  }}
                >
                  <div className="card__view__data">
                    <p className="card__view__preview">Preview</p>
                    <p className="card__play__icon">
                      <svg
                        width="8px"
                        height="8px"
                        viewBox="-0.5 0 7 7"
                        version="1.1"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g
                            id="Dribbble-Light-Preview"
                            transform="translate(-347.000000, -3766.000000)"
                            fill="#000000"
                          >
                            <g
                              id="icons"
                              transform="translate(56.000000, 160.000000)"
                            >
                              <path
                                fill="#EAECEE"
                                d="M296.494737,3608.57322 L292.500752,3606.14219 C291.83208,3605.73542 291,3606.25002 291,3607.06891 L291,3611.93095 C291,3612.7509 291.83208,3613.26444 292.500752,3612.85767 L296.494737,3610.42771 C297.168421,3610.01774 297.168421,3608.98319 296.494737,3608.57322"
                                id="play-[#1003]"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </p>
                    <p className="card__length">
                      {item.duration !== undefined
                        ? formatDuration(item.duration)
                        : "Loading..."}
                    </p>
                  </div>
                </div>
                <div className="card__content">
                  <h3 className="channel__video__name text-center">
                    {item.name.length > 30
                      ? `${item.name.substring(0, 30)}...`
                      : item.name}
                  </h3>
                  <div className="channel__data">
                    <div className="channel__data__text">
                      <p className="channel__name  text-center">
                        {item.description.length > 30
                          ? `${item.description.substring(0, 30)}...`
                          : item.description}
                      </p>
                      <div className="channel__subdata">
                        <p className="channel__views">
                          519.7K Views
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Search;
