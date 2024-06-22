import React, { useState, useEffect, useContext, useCallback, memo } from "react";
import axios from "axios";
import "../css/uploadPodcast.css";
import Cookies from "js-cookie";
import "../css/Dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicPlayerContext } from "../App"; // Import the context

const Dashboard = memo(({ setMenuOpened, logout, setUserlogged, setPlayerVisible }) => {
  const [loader, setLoader] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [favouriteAlbum, setFavouriteAlbum] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { handlePlay } = useContext(MusicPlayerContext); // Use the context

  const shuffleCategories = (array) => {
    const arr = [...array]; // Clone the array to avoid modifying the original
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr;
  };

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

  
  const fetchUserFavorites = useCallback(async () => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return [];
    }

    try {
      const response = await axios.get(
        "https://podstar-1.onrender.com/api/user/favourite-albums",
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const favoriteAlbumArray = response.data;
      setFavouriteAlbum(favoriteAlbumArray);
      return favoriteAlbumArray;
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      return [];
    }
  }, [logout, navigate, setMenuOpened, setPlayerVisible, setUserlogged]);

  const fetchCategoryData = useCallback(async (categories) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }
    try {
      const userFavourites = await fetchUserFavorites(); // Ensure user favorites are fetched first

      const categoryDataPromises = categories.map(async (category) => {
        const response = await axios.get(
          `https://podstar-1.onrender.com/api/album/${category}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const userFavouriteIds = userFavourites.map(fav => fav.id);

        const dataWithDurations = await Promise.all(
        response.data.map(async (item) => {
          const duration = await getAudioDuration(item.albumUrl);
          return { 
            ...item, 
            duration, 
            isFavorite: userFavouriteIds.includes(item.id) 
          };
        })
        );
        return { category, data: dataWithDurations };
      });

      const categoryDataArray = await Promise.all(categoryDataPromises);
      const categoryData = categoryDataArray.reduce((acc, curr) => {
        acc[curr.category] = curr.data;
        return acc;
      }, {});

      setCategoryData(categoryData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  }, [logout, navigate, fetchUserFavorites, setMenuOpened, setPlayerVisible, setUserlogged]);

  
  const fetchCategories = useCallback(async () => {
    setLoader(true);
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        "https://podstar-1.onrender.com/api/album/categories",
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const categories = response.data;
      const shuffledCategories = shuffleCategories(categories);
      setCategories(shuffledCategories);
      await fetchCategoryData(shuffledCategories);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  }, [logout, navigate, fetchCategoryData, setMenuOpened, setPlayerVisible, setUserlogged]);

  useEffect(() => {
    if (location.pathname === "/dashboard" || location.pathname === "/") {
      fetchCategories();
    }
  }, [logout, location.pathname, fetchCategories, navigate, setUserlogged, setMenuOpened, setPlayerVisible]);

  const addToRecentlyPlayed = useCallback(async (item) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `https://podstar-1.onrender.com/api/user/recently-played?id=${item.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, [logout, setPlayerVisible, setMenuOpened, setUserlogged, navigate]);

  const handleCardClick = useCallback((item) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }
    addToRecentlyPlayed(item);
    handlePlay(item);
  }, [logout, setMenuOpened,addToRecentlyPlayed, setUserlogged, navigate, handlePlay, setPlayerVisible]);


  const handleFavoriteClick = async (category, index) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }
  
    try {
      const item = categoryData[category][index];
      const response = await axios.get(`https://podstar-1.onrender.com/api/user/add-favourite?id=${item.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = response.data;
      if (response.status === 200 && data === "Album added to favourites!") {
        const updatedCategoryData = { ...categoryData };
        updatedCategoryData[category][index].isFavorite = true;
        setCategoryData(updatedCategoryData);
  
        const updatedFavouriteAlbum = [...favouriteAlbum, item.id];
        setFavouriteAlbum(updatedFavouriteAlbum);
        Cookies.set("user", JSON.stringify({ ...JSON.parse(Cookies.get("user")), favouriteAlbum: updatedFavouriteAlbum }));
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };
  
  const handleFilledFavoriteClick = async (category, index) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }
  
    try {
      const item = categoryData[category][index];
      const response = await axios.delete(`https://podstar-1.onrender.com/api/user/remove-favourite?id=${item.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = response.data;
      if (response.status === 200 && data === "Album removed from favourites!") {
        const updatedCategoryData = { ...categoryData };
        updatedCategoryData[category][index].isFavorite = false;
        setCategoryData(updatedCategoryData);
  
        const updatedFavouriteAlbum = favouriteAlbum.filter(id => id !== item.id);
        setFavouriteAlbum(updatedFavouriteAlbum);
        Cookies.set("user", JSON.stringify({ ...JSON.parse(Cookies.get("user")), favouriteAlbum: updatedFavouriteAlbum }));
      }
    } catch (error) {
      console.error('Error removing from favourites:', error);
    }
  };
  
  
  

  return (
    <>
      {loader ? (
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
      ) : (
        <div id="content"
          style={{ overflowY: "auto", height: "100vh", marginBottom: "50px" }}
        >
          {categories.map(
            (category) =>
              categoryData[category] &&
              categoryData[category].length > 0 && (
                <div key={category}>
                  <h1
                    style={{
                      marginLeft: "3%",
                      marginTop: "2.5%",
                      marginBottom: "2.5%",
                      fontSize: "25px",
                    }}
                  >
                    <b>{category}</b>
                  </h1>
                  <div className="container-fluid text-center">
                    <div
                      className="row" id="row"
                      style={{ marginTop: "2.5%", marginLeft: "1.5%", marginRight: "2.8%" }}
                    >
                      {categoryData[category].map((item, index) => (
                        <div key={index} className="col-sm-3" style={{}}>
                          <div
                            className="card"
                            style={{ marginLeft: "20px", marginRight: "20px", marginBottom: "20px" }}
                            onClick={() => handleCardClick(item)}
                          >
                            <div
                              className="card__view"
                              style={{
                                backgroundImage: `url(${item.thumbnailUrl})`,
                              }}
                            >
                              <div className="card__favorite__icon__wrapper" onClick={(e) => e.stopPropagation()}>
                                {!item.isFavorite ? (
                                  <div className="card__favorite__icon" onClick={(e) => {
                                    e.stopPropagation();
                                    handleFavoriteClick(category, index);
                                  }}>
                                    <svg
                                      width="16px"
                                      height="16px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-heart"
                                    >
                                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="card__favorite__icon--filled" onClick={(e) => {
                                    e.stopPropagation();
                                    handleFilledFavoriteClick(category, index);
                                  }}>
                                    <svg
                                      width="16px"
                                      height="16px"
                                      viewBox="0 0 24 24"
                                      fill="red"
                                      stroke="red"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-heart"
                                    >
                                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                  </div>
                                )}
                              </div>
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
                                <p className="card__lenght">
                                  {item.duration !== undefined
                                    ? formatDuration(item.duration)
                                    : "Loading..."}
                                </p>
                              </div>
                            </div>
                            <div className="card__content">
                              <h3 className="channel__video__name">
                                {item.name.length > 30
                                  ? `${item.name.substring(
                                    0,
                                    30
                                  )}...`
                                  : item.name}
                              </h3>
                              <div className="channel__data">
                                <div className="channel__data__text">
                                  <p className="channel__name">
                                    {item.description.length > 60
                                      ? `${item.description.substring(
                                        0,
                                        60
                                      )}...`
                                      : item.description}
                                  </p>
                                  <div className="channel__subdata">
                                    <p className="channel__views">
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
              )
          )}
        </div>
      )}
    </>
  );
});

export default Dashboard;
