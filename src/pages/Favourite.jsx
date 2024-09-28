import React, { memo, useState, useEffect, useCallback, useContext } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';
import "../utils/Themes";
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { MusicPlayerContext } from "../App";
import "../css/Favorites.css";
import { DeleteRounded } from '@mui/icons-material';
import { FavoriteAlbumContext } from '../utils/Contexts/FavoriteAlbumContext';

const Favorites = memo(({ setMenuOpened, logout, setUserlogged, setPlayerVisible, darkMode }) => {
  const [loader, setLoader] = useState(true);
  const [favorites, setFavorites] = useContext(FavoriteAlbumContext);
  const navigate = useNavigate();
  const { handlePlay } = useContext(MusicPlayerContext);

  const validateTokenAndNavigate = useCallback(() => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return false;
    }
    return true;
  }, [logout, setMenuOpened, setPlayerVisible, setUserlogged, navigate]);

  const addToRecentlyPlayed = useCallback(async (item) => {
    if (!validateTokenAndNavigate()) return;

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
      console.error('Error adding to recently played:', error);
    }
  }, [validateTokenAndNavigate]);

  const handleCardClick = useCallback((item) => {
    if (!validateTokenAndNavigate()) return;

    addToRecentlyPlayed(item);
    handlePlay(item);
  }, [validateTokenAndNavigate, addToRecentlyPlayed, handlePlay]);

  const deleteFromFavorites = useCallback(async (item) => {
    if (!validateTokenAndNavigate()) return;

    const originalFavorites = [...favorites];
    setFavorites(favorites.filter(fav => fav.id !== item.id));

    try {
      const response = await axios.delete(`https://podstar-1.onrender.com/api/user/remove-favourite?id=${item.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      });

      if (response.data !== "Album removed from favourites!") {
        setFavorites(originalFavorites);
      }
    } catch (error) {
      setFavorites(originalFavorites); // Restore in case of error
      console.error('Error removing from favorites:', error);
    }
  }, [validateTokenAndNavigate, favorites, setFavorites]);

  useEffect(() => {
    // Set loader to false after fetching favorites from context
    if (favorites) {
      setLoader(false);
    }
  }, [favorites]);

  const truncateText = (text, maxLength) => {
    if (!text) return '';  // Return empty string if text is undefined or null
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };
  

  return (
    <div className="favorites-container">
      {loader ? (
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      ) : (
        <div className="favorites-content">
          <h1 className="favorites-title"><b>Favourites</b></h1>
          <Box className="favorites-grid">
            {favorites.map((item, index) => (
              <Card 
                key={index} 
                className="favorites-card"
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  border: 'none', 
                  backgroundColor: darkMode ? 'rgb(28, 30, 39)' : 'rgb(240, 240, 240)',
                  color: darkMode ? '#F2F3F4' : '#111111',
                  borderRadius: '18px',
                  boxShadow: 3,
                  position: 'relative', 
                }}
                onClick={() => handleCardClick(item)}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.5)', // Hazy black overlay
                    borderRadius: '50%',
                    padding: '3px',
                    cursor: 'pointer',
                  }}
                >
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      deleteFromFavorites(item);
                    }} 
                    style={{ color: '#fff', padding:'4px' }}
                  >
                    <DeleteRounded fontSize="small"/>
                  </IconButton>
                </div>
                <CardMedia
                  component="img"
                  image={item.thumbnailUrl}
                  alt={item.name}
                  sx={{ 
                    width: '100%', 
                    height: 170, 
                    objectFit: 'unset' 
                  }}
                />
                <CardContent>
                  <Typography component="div" variant="p" style={{ color: darkMode ? '#F2F3F4' : '#111111', fontSize:"18px" }}>
                    <b>{item.name}</b>
                  </Typography>
                  <Typography variant="p" color="text.secondary" component="div" style={{ color: darkMode ? '#F2F3F4' : '#111111' }}>
                    {truncateText(item.description, 50)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </div>
      )}
    </div>
  );
});

export default Favorites;
