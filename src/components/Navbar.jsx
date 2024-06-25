import React, { memo, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ArrowRightAltRounded, MenuRounded, PersonRounded, AccountCircleTwoTone, ManageAccountsRounded, ExitToAppRounded } from "@mui/icons-material";
import { IconButton, Box, Tooltip, Menu, MenuItem, Typography, Avatar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from "../Images/Logo.png";
import "../css/navbar.css";

const NavbarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right:18px;
  padding-left:28px !important;
  align-items: center;
  gap: 15px;
  color: ${({ theme }) => theme.text_primary};
  background: ${({ theme }) => theme.bgLight};
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.7px);
  -webkit-backdrop-filter: blur(5.7px);
  @media (max-width: 768px) {
    padding-left:23px;
    padding-right:16px;
    gap: 10px;
  }
`;

const LogoText = styled.div`
  margin-top: 10px;
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
  margin: 16px 0;
  padding-left: 5px;
  @media (max-width: 768px) {
    font-size: 31px;
  }
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
  @media (max-width: 768px) {
    height: 31px;
  }
`;

const IcoButton = styled(IconButton)`
  color: ${({ theme }) => theme.text_secondary} !important;
  padding: 0; /* Ensure no extra padding */
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const CustomMenu = styled(Menu)`
  .MuiPaper-root {
    background-color: ${({ theme }) => theme.bgLight};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const Navbar = ({ toggleMenu, setUserlogged, menuOpened,profileImageUrl, setProfileImageUrl, setPlayerVisible, setMenuOpen, userlogged, setDarkMode, darkMode, logout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  

  const toggle = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      if (userData.profileImageUrl) {
        setProfileImageUrl(userData.profileImageUrl);
      }
    }
  }, [setProfileImageUrl]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = useCallback(() => {
    setMenuOpen(false);
    setPlayerVisible(false);
    logout();
    setProfileImageUrl(null);
    setUserlogged(false);
    navigate("/login");
  }, [setMenuOpen, setProfileImageUrl, setPlayerVisible, logout, setUserlogged, navigate]);

  const settings = [
    { name: 'Profile', icon: <ManageAccountsRounded />, url: '/profile' },
    { name: 'Logout', icon: <ExitToAppRounded />, fun: handleLogout }
  ];

  return (
    <NavbarDiv>
      {userlogged && (
        <IcoButton onClick={toggleMenu}>
          <MenuRounded />
        </IcoButton>
      )}
      <Link to="/" style={{ textDecoration: "none" }}>
        <Logo>
          <Image src={logo} alt="logo" />
          <LogoText>Podstar</LogoText>
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

      {!userlogged && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgot-password' && (
        <LetsGoButton as={Link} to="/login">
          Let's Go
          <ArrowRightAltRounded />
        </LetsGoButton>
      )}

      {!userlogged && location.pathname !== '/signup' && location.pathname !== '/' && location.pathname !== '/forgot-password' && (
        <ButtonDiv as={Link} to="/signup" style={{ display: "flex" }}>
          <PersonRounded />
          Register
        </ButtonDiv>
      )}

      {userlogged && (
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IcoButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {profileImageUrl ? (
                <Avatar alt="Profile Image" src={profileImageUrl} style={{ width: 40, height: 40 }} />
              ) : (
                <AccountCircleTwoTone style={{ fontSize: 40 }} />
              )}
            </IcoButton>
          </Tooltip>
          <CustomMenu
            sx={{ mt: '60px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting.name} onClick={handleCloseUserMenu} style={{ textDecoration: "none" }}>
                {setting.name === "Logout" ? (
                  <>
                    {setting.icon}
                    <Typography onClick={setting.fun} textAlign="center" style={{ marginLeft: "8px" }}>{setting.name}</Typography>
                  </>
                ) : (
                  <>
                    {setting.icon}
                    <Typography id="profile" as={Link} to={setting.url} textAlign="center" style={{ marginLeft: "8px", color: darkMode ? "white" : "black", textDecoration: "none" }}>{setting.name}</Typography>
                  </>
                )}
              </MenuItem>
            ))}
          </CustomMenu>
        </Box>
      )}
    </NavbarDiv>
  );
};

export default memo(Navbar);
