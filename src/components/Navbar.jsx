import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { ArrowRightAltRounded, MenuRounded, PersonRounded } from "@mui/icons-material";
import { IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import logo from "../Images/Logo.png";
import "../css/navbar.css";

const NavbarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 40px;
  align-items: center;
  gap: 30px;
  color: ${({ theme }) => theme.text_primary};
  background: ${({ theme }) => theme.bgLight};
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.7px);
  -webkit-backdrop-filter: blur(5.7px);
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const LogoText = styled.div`
  margin-top:10px;
  font-family: "Sacramento", cursive;
  font-weight: 800;
  font-style: normal;
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 35px;
  margin: 16px px;
  padding-left: 5px;
`;

const ButtonDiv = styled.div`
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  align-items: center;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  display: flex;
  border-radius: 25px;
  gap: 7px;
  padding: 8px 10px;
`;

const LetsGoButton = styled(ButtonDiv)`
  font-weight: bold;
  max-width: none; 
`;

const Image = styled.img`
  height: 40px;
`;

const IcoButton = styled(IconButton)`
  color: ${({ theme }) => theme.text_secondary} !important;
`;

const Navbar = ({ toggleMenu, setUserlogged, menuOpened, userlogged, setDarkMode, darkMode, logout }) => {
  const location = useLocation();
  const toggle = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  // Memoize the logout function
  const handleLogout = useCallback(() => {
    logout();
    setUserlogged(false);
  }, [logout, setUserlogged]);

  return (
    <NavbarDiv>
      {userlogged && (
        <IcoButton onClick={toggleMenu}>
          <MenuRounded />
        </IcoButton>
      )}
      <Link to="/" style={{textDecoration:"none"}}>
        <Logo>
          <Image src={logo} alt="logo" />
          <LogoText>
          Podstar
          </LogoText>
        </Logo>
      </Link>
      <label className="switch" style={{ display: "flex", marginLeft: "auto" }}>
        <input type="checkbox" checked={darkMode} onChange={toggle} />
        <span className="slider"></span>
      </label>
      {!userlogged && location.pathname !== '/login' && location.pathname !== '/' && (
        <ButtonDiv as={Link} to="/login">
          <PersonRounded />
          Login
        </ButtonDiv>
      )}

      {!userlogged && location.pathname !== '/login' && location.pathname !== '/signup' && (
        <LetsGoButton as={Link} to="/login">
          Let's Go
          <ArrowRightAltRounded />
        </LetsGoButton>
      )}

      {!userlogged && location.pathname !== '/signup' && location.pathname !== '/' && (
        <ButtonDiv as={Link} to="/signup" style={{ display: "flex" }}>
          <PersonRounded />
          Register
        </ButtonDiv>
      )}
      {userlogged && (
        <ButtonDiv as="div" onClick={handleLogout} style={{ display: "none" }}>
          <PersonRounded />
          Logout
        </ButtonDiv>
      )}
    </NavbarDiv>
  );
};

export default memo(Navbar);
