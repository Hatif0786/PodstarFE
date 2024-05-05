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

  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container >
        <BrowserRouter>
          {menuOpen && (<Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setDarkMode={setDarkMode} darkMode={darkMode} />)}
          <Frame>
            <Navbar toggleMenu={toggleMenu} menuOpen={menuOpen} setDarkMode={setDarkMode} darkMode={darkMode}  />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload-podcast" element={<UploadPodcast />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favourite" element={<Favourite />} />
              <Route path="/login"  element={<Login darkMode={darkMode} setMenuOpen={setMenuOpen}/>}/>
              <Route path="/signup"  element={<Register darkMode={darkMode}/>}/>
              <Route path="/upload-audio" element={<UploadPodcastAudio />} />
            </Routes>
          </Frame>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
