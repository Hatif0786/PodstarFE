import React, { memo, useState, useEffect, useCallback, useContext } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';
import "../utils/Themes";
import "../css/History.css";
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FavoriteRounded, MoreVertRounded, ThumbUpAltRounded, ThumbDownAltRounded, DeleteRounded, AddRounded } from "@mui/icons-material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MusicPlayerContext } from "../App";
import { FavoriteAlbumContext } from '../utils/Contexts/FavoriteAlbumContext';

const History = memo(({ setMenuOpened, logout, setUserlogged, setPlayerVisible, darkMode }) => {
  const [loader, setLoader] = useState(true);
  const [results, setResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [favorites] = useContext(FavoriteAlbumContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const { handlePlay } = useContext(MusicPlayerContext);

  const isFavorite = (item) => {
    return favorites.some(fav => fav.id === item.id);
  };

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
      const response = await axios.post(
        `https://podstar-1.onrender.com/api/user/recently-played?id=${item.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setResults(response.data);
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
  }, [logout, setMenuOpened, addToRecentlyPlayed, setPlayerVisible, setUserlogged, navigate, handlePlay]);

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const deleteFromRecentlyPlayed = useCallback(async (item) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(`https://podstar-1.onrender.com/api/user/recently-played?id=${item.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [logout, setPlayerVisible, setMenuOpened, setUserlogged, navigate]);

  const fetchRecentlyPlayedResults = useCallback(async () => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`https://podstar-1.onrender.com/api/user/recently-played?id=${JSON.parse(Cookies.get('user')).id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = response.data;
      setResults(data);
      setLoader(false);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setLoader(false);
    }
  }, [logout, setPlayerVisible, setMenuOpened, setUserlogged, navigate]);

  useEffect(() => {
    fetchRecentlyPlayedResults();
  }, [fetchRecentlyPlayedResults]);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="history-container">
      {loader ? (
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      ) : (
        <div className="history-content">
          <h1 className="history-title" id="historyTitle"><b>Recently Played</b></h1>
          {results.map((result, index) => (
            <Card 
              key={index} 
              className="history-card"
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                position: 'relative', 
                zIndex: '0', 
                border: 'none', 
                backgroundColor: darkMode ? 'rgb(28, 30, 39)' : 'rgb(240, 240, 240)',
                color: darkMode ? '#F2F3F4' : '#111111',
                maxHeight: { xs: 'none', sm: '200px' },
                overflow: 'hidden',
                marginBottom: '20px',
                borderRadius:'18px'
              }}
            >
              <div className="card-media-wrapper">
                <CardMedia
                  component="img"
                  className="card-media"
                  image={result.thumbnailUrl}
                  alt={result.name}
                  style={{objectFit:"unset"}}
                  sx={{ width: { xs: '100%', sm: '171px' }, height: { xs: 'auto', sm: '151px' } }}
                />
                {/* Fading effect over image */}
                <div className="card-media-overlay" />
              </div>

              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }} onClick={() => handleCardClick(result)}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography className='text' component="div" variant="h5" style={{color: darkMode ? '#F2F3F4' : '#111111'}}>
                    <b>{result.name}</b>
                  </Typography>
                  <Typography className='text' variant="subtitle1" color="text.secondary" component="div" style={{color: darkMode ? '#F2F3F4' : '#111111'}}>
                    {truncateText(result.description, 50)}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pl: 1, pb: 1 }}>
                  {!isFavorite(result) && (<IconButton aria-label="favorite" style={{ color: darkMode ? '#F2F3F4' : '#111111' }}>
                    <FavoriteRounded sx={{ height: 30, width: 30 }} />
                  </IconButton>)}
                  {isFavorite(result) && (
                    <IconButton style={{ color: 'red' }}>
                      <svg
                        width="30px"
                        height="26px"
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
                    </IconButton>
                  )}
                  <IconButton aria-label="play/pause" style={{color: darkMode ? '#F2F3F4' : '#111111'}}>
                    <ThumbUpAltRounded sx={{ height: 30, width: 30 }} />
                  </IconButton>
                  <IconButton aria-label="next" style={{color: darkMode ? '#F2F3F4' : '#111111'}}>
                    <ThumbDownAltRounded sx={{ height: 30, width: 30 }} />
                  </IconButton>
                </Box>
              </Box>

              <div className="icon-button-container">
                <IconButton 
                  aria-label="menu" 
                  style={{color: darkMode ? '#F2F3F4' : '#111111'}}
                  onClick={(event) => handleMenuClick(event, result)}
                >
                  <MoreVertRounded />
                </IconButton>
                <Menu
                  id="sideMenu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => { deleteFromRecentlyPlayed(selectedItem); handleMenuClose(); }}>
                    <DeleteRounded /><b style={{marginLeft:"8px"}}>Delete</b>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <AddRounded /><b style={{marginLeft:"8px"}}>More</b>
                  </MenuItem>
                </Menu>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});

export default History;
