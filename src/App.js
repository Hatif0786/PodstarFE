import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/Themes";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Favourite from "./pages/Favourite";
import UploadPodcast from "./pages/UploadPodcast";
import UploadPodcastAudio from "./pages/UploadPodcastAudio";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuth from './utils/useAuth';
import Homepage from "./pages/Homepage";

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

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <Container>
          {menuOpen && <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setDarkMode={setDarkMode} darkMode={darkMode} logout={logout} setUserlogged={setUserlogged} />}
          <Frame>
            <Navbar
              userlogged={userlogged}
              menuOpened={menuOpened}
              setUserlogged={setUserlogged}
              toggleMenu={toggleMenu}
              setDarkMode={toggleDarkMode}
              darkMode={darkMode}
              logout={logout}
            />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login darkMode={darkMode} onLogin={checkAuth} setUserlogged={setUserlogged} setMenuOpen={setMenuOpen} />} />
              <Route path="/signup" element={<Register darkMode={darkMode} />} />
              {isAuthenticated ? (
                <>
                  <Route path="/dashboard" element={<Dashboard setMenuOpened={setMenuOpened} logout={logout} setUserlogged={setUserlogged} />} />
                  <Route path="/upload-podcast" element={<UploadPodcast setMenuOpened={setMenuOpened} logout={logout} setUserlogged={setUserlogged} menuOpened={menuOpened} darkMode={darkMode} />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/favourite" element={<Favourite />} />
                  <Route path="/upload-audio" element={<UploadPodcastAudio setMenuOpened={setMenuOpened} logout={logout} setUserlogged={setUserlogged} menuOpened={menuOpened} />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </Frame>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
