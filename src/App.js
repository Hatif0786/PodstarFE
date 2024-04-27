import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/Themes";
import Sidebar from "./components/Sidebar";
import {Route, Router, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import { BrowserRouter } from 'react-router-dom';

function App() {
  const Container = styled.div`
    display: flex;
    overflow-x:hidden;
    overflow-y:hidden;
    background: ${({ theme }) => theme.bgLight};
    width: 100%;
    height: 100vh;
  `;

  const Frame = styled.div`
    display: flex;
    flex-direction: column;
    flex:3;
  `;

  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <ThemeProvider theme={darkMode? darkTheme : lightTheme}>
        <Container >
        <BrowserRouter>
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setDarkMode={setDarkMode} darkMode={darkMode}/>  
            <Frame>
              <Navbar setMenuOpen={setMenuOpen} menuOpen={menuOpen}/>
              Horizon
            </Frame>
        </BrowserRouter>
        </Container>
    </ThemeProvider>
  );
}

export default App;