import React, { memo, useState, useEffect, useCallback } from 'react';
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
// import { MusicPlayerContext } from "../App";
import "../css/Favorites.css"
import { DeleteRounded } from '@mui/icons-material';

const Favorites = memo(({ setMenuOpened, logout, setUserlogged, setPlayerVisible, darkMode }) => {
  const [loader, setLoader] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  // const { handlePlay } = useContext(MusicPlayerContext);

  const deleteFromFavorites = useCallback(async (item) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(`https://podstar-1.onrender.com/api/user/favorites?id=${item.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error deleting item from favorites:', error);
    }
  }, [logout, setPlayerVisible, setMenuOpened, setUserlogged, navigate]);

  const fetchFavoriteResults = useCallback(async () => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`https://podstar-1.onrender.com/api/user/favourite-albums`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = response.data;
      setFavorites(data);
      setLoader(false);
    } catch (error) {
      console.error('Error fetching favorite results:', error);
      setLoader(false);
    }
  }, [logout, setPlayerVisible, setMenuOpened, setUserlogged, navigate]);

  useEffect(() => {
    fetchFavoriteResults();
  }, [fetchFavoriteResults]);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="favorites-container">
      {loader ? (
        <section className="loader-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      ) : (
        <div className="favorites-content">
          <h1 className="favorites-title"><b>Favourites</b></h1>
          <Box
            className="favorites-grid"
          >
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
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.5)', // Hazzy black overlay
                    borderRadius: '50%',
                    padding: '3px',
                    cursor: 'pointer',
                  }}
                >
                  <IconButton 
                    onClick={() => deleteFromFavorites(item)} 
                    style={{ color: '#fff', padding:'4px' }} // White icon color
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
