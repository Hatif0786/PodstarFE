import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/Themes";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Favourite from "./pages/Favourite";
import UploadPodcast from "./pages/UploadPodcast";
import UploadPodcastAudio from "./pages/UploadPodcastAudio";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userlogged, setUserlogged] = useState(false);

  const Container = styled.div`
    display: flex;
    overflow-x: hidden;
    overflow-y: hidden;
    background: ${({ theme }) => theme.bgLight};
    width: 100%;
    height: 100vh;
  `;

  const Frame = styled.div`
    display: flex;
    flex-direction: column;
    flex: 3;
  `;

  const toggleMenu = () => {
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Container menuOpen={menuOpen}>
          {menuOpen && (<Sidebar setMenuOpen={setMenuOpen} setDarkMode={setDarkMode} darkMode={darkMode} />)}
          <Frame>
            <Navbar userlogged={userlogged} setUserlogged={setUserlogged} toggleMenu={toggleMenu} setDarkMode={toggleDarkMode} darkMode={darkMode}  />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload-podcast" element={<UploadPodcast darkMode={darkMode} />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favourite" element={<Favourite />} />
              <Route path="/login"  element={<Login darkMode={darkMode} setUserlogged={setUserlogged} setMenuOpen={setMenuOpen}/>}/>
              <Route path="/signup"  element={<Register darkMode={darkMode}/>}/>
              <Route path="/upload-audio" element={<UploadPodcastAudio />} />
            </Routes>
          </Frame>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
