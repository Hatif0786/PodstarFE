import React, { useState, useEffect, useRef, createContext, useCallback, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/Themes";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Favourite from "./pages/Favourite";
import History from "./pages/History";
import UploadPodcast from "./pages/UploadPodcast";
import UploadPodcastAudio from "./pages/UploadPodcastAudio";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuth from './utils/useAuth';
import Homepage from "./pages/Homepage";
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import CookieConsent from "./utils/CookiesConsent";
import Cookies from "js-cookie";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound"
import Profile from "./pages/Profile";
// Create a context to share the music player state
export const MusicPlayerContext = createContext();

const Container = styled.div`
  display: flex;
  overflow-x: hidden;
  overflow-y: hidden;
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  height: 100vh;
`;

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpened, setMenuOpened] = useState(true);
  const { isAuthenticated, loading, checkAuth, logout } = useAuth();
  const [userlogged, setUserlogged] = useState(isAuthenticated);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [audioLists, setAudioLists] = useState([]);
  const [isPlayerVisible, setPlayerVisible] = useState(false);
  const playerRef = useRef(null);
  const userCookie = Cookies.get('user');
  const userRole = userCookie ? JSON.parse(userCookie).role : null;

  const handlePlay = useCallback((item) => {
    const newAudioLists = [
      { name: item.name, musicSrc: item.albumUrl, cover: item.thumbnailUrl },
    ];
    setAudioLists(newAudioLists);
    setPlayerVisible(true);
    if (playerRef.current) {
      playerRef.current.playByIndex(0);
    }
  }, []);

  const musicPlayerContextValue = useMemo(() => ({ handlePlay }), [handlePlay]);

  const toggleMenu = () => {
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
    setMenuOpened(prevMenuOpened => !prevMenuOpened);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  useEffect(() => {
    checkAuth();
    setUserlogged(isAuthenticated);
    if (!isAuthenticated) {
      setMenuOpen(false);  // Close the sidebar if not authenticated
    }
  }, [isAuthenticated, checkAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const StyledMusicPlayer = styled(ReactJkMusicPlayer)`
    margin-top: 4.5%;

    @media (max-width: 576px) {
      margin-top: 17%;
    }
  `;

  
  return (
    <MusicPlayerContext.Provider value={musicPlayerContextValue}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <Router>
          <Container>
            {menuOpen && <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setDarkMode={setDarkMode} darkMode={darkMode} logout={logout} setUserlogged={setUserlogged} setPlayerVisible={setPlayerVisible} userRole={userRole}/>}
            <Frame>
              <Navbar
                userlogged={userlogged}
                menuOpened={menuOpened}
                setUserlogged={setUserlogged}
                toggleMenu={toggleMenu}
                setDarkMode={toggleDarkMode}
                setMenuOpen={setMenuOpen}
                darkMode={darkMode}
                profileImageUrl={profileImageUrl}
                setProfileImageUrl={setProfileImageUrl}
                setPlayerVisible={setPlayerVisible}
                logout={logout}
              />
              <Routes>
              <Route path="/" element={isAuthenticated ? <Dashboard setMenuOpened={setMenuOpened} logout={logout} setUserlogged={setUserlogged} setPlayerVisible={setPlayerVisible}/> : <Homepage />} />
                <Route path="/login" element={<Login profileImageUrl={profileImageUrl} setProfileImageUrl={setProfileImageUrl} darkMode={darkMode} onLogin={checkAuth} setUserlogged={setUserlogged} setMenuOpen={setMenuOpen} />} />
                <Route path="/signup" element={<Register darkMode={darkMode} />} />
                <Route path="/forgot-password" element={<ForgotPassword darkMode={darkMode} />} />
                {isAuthenticated ? (
                  <>
                    <Route path="/dashboard" element={<Dashboard setMenuOpened={setMenuOpened} logout={logout} setUserlogged={setUserlogged} setPlayerVisible={setPlayerVisible}/>} />
                    <Route path="/upload-podcast" element={<UploadPodcast setMenuOpened={setMenuOpened} logout={logout} setUserlogged={setUserlogged} menuOpened={menuOpened} darkMode={darkMode} setPlayerVisible={setPlayerVisible}/>} />
                    <Route path="/search" element={<Search setPlayerVisible={setPlayerVisible} logout={logout} setUserlogged={setUserlogged} setMenuOpened={setMenuOpened} darkMode={darkMode}/>} />
                    <Route path="/favourite" element={<Favourite setPlayerVisible={setPlayerVisible}/>} />
                    <Route path="/history" element={<History darkMode={darkMode} setPlayerVisible={setPlayerVisible}  logout={logout} setUserlogged={setUserlogged} setMenuOpened={setMenuOpened}/>} />
                    <Route path="/upload-audio" element={<UploadPodcastAudio setMenuOpened={setMenuOpened} logout={logout} setUserlogged={setUserlogged} menuOpened={menuOpened} setPlayerVisible={setPlayerVisible}/>} />
                    <Route path="*" element={<NotFound darkMode={darkMode} />} />
                    <Route path="/profile" element={<Profile darkMode={darkMode} setMenuOpened={setMenuOpened} logout={logout} setUserlogged={setUserlogged} setPlayerVisible={setPlayerVisible} profileImageUrl={profileImageUrl} setProfileImageUrl={setProfileImageUrl}/>} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/login" />} />
                )}
              </Routes>
            </Frame>
          </Container>
        </Router>
        {isPlayerVisible && (
          <StyledMusicPlayer
            audioLists={audioLists}
            showMediaSession
            autoPlay={true}
            mode="full"
            showDownload={false}
            glassBg={true}
            showReload={false}
            showThemeSwitch={false}
            responsive={false}
            spaceBar={true}
            showPlayMode={false}
            toggleMode={false}
            clearPriorAudioLists={true}
            getAudioInstance={(instance) => {
              playerRef.current = instance;
            }}
          />
        )}
        <CookieConsent />
      </ThemeProvider>
    </MusicPlayerContext.Provider>
  );
}

export default App;
