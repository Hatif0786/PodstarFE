import React, {useCallback} from 'react';
import { HomeRounded, CloseRounded, SearchRounded, FavoriteRounded, LightModeRounded, LogoutRounded, DarkModeRounded, CloudUploadRounded, ManageAccountsRounded} from "@mui/icons-material";
import styled from 'styled-components';
import logo from "../Images/Logo.png";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const MenuContainer = styled.div`
    flex:0.5;
    flex-direction: column;
    display:flex;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text_primary};
    height: 100vh;
    @media (max-width: 1100px) {
        position: fixed;
        z-index: 1000;
        width: 100%;
        max-width: 250px;
        left: ${({ menuOpen }) => (menuOpen ? '0' : '-100%')};
        transition: 0.3s ease-in-out;
    }
  `;

const Logo = styled.div`
    color: ${({ theme }) => theme.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 20px;
    margin: 16px 0px;
    padding-left: 25px;
`;

const Image = styled.img`
    height: 40px;
`;

const Flex = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px 12px;
`;

const LogoText = styled.div`
  margin-top:10px;
  font-family: "Sacramento", cursive;
  font-weight: 800;
  font-style: normal;
  font-size: 35px;
`;

const Elements = styled.div`
    padding: 4px 16px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    color: ${({ theme }) => theme.text_secondary};
    width: 100%;
    &:hover .content-container {
        // background-color: ${({ theme }) => theme.text_secondary + 50};
    }
`;

const ContentContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const NavText = styled.div`
    padding: 12px 0px;
    text-decoration: none !important;
`;

const HR = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.text_secondary + 50};
    margin: 10px 0px;
`;

const Close = styled.div`
    display: none;
    @media (max-width: 1100px){
        display:block;
    }
    cursor: pointer;
`;

const Sidebar = ({ menuOpen, setMenuOpen, setDarkMode, darkMode, logout, setUserlogged, setPlayerVisible, userRole }) => {
  const navigate = useNavigate();

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  // Memoize the logout function
  const handleLogout = useCallback(() => {
    setMenuOpen(false);
    setPlayerVisible(false);
    logout();
    setUserlogged(false);
    navigate("/login");
  }, [setMenuOpen, setPlayerVisible, logout, setUserlogged, navigate]);


  const menuItems = [
    {
      link: "/dashboard",
      name: "Dashboard",
      icon: <HomeRounded />
    },
    {
      link: "/search",
      name: "Search",
      icon: <SearchRounded />
    },
    {
      link: "/favourite",
      name: "Favourites",
      icon: <FavoriteRounded />
    }
  ];

  const button = [
    {
      fun: () => {
        setMenuOpen(false);
        navigate("/upload-audio");
      },
      name: "Upload Podcast",
      icon: <CloudUploadRounded />,
      visible: userRole === "ADMIN" // Show only if user role is ADMIN
    },
    {
      fun: () => {
        setMenuOpen(false);
        navigate("/user-mgmt")
      },
      name: "User Management",
      icon: <ManageAccountsRounded />,
      visible: userRole === "ADMIN" // Show only if user role is ADMIN
    },
    {
      fun: toggleDarkMode,
      name: darkMode ? "Light Mode" : "Dark Mode",
      icon: darkMode ? <LightModeRounded /> : <DarkModeRounded />,
      visible: true // Always visible
    },
    {
      fun: handleLogout,
      name: "Logout",
      icon: <LogoutRounded />,
      visible: true // Always visible
    }
  ];

  return (
    <MenuContainer menuOpen={menuOpen}>
      <Flex>
        <Logo>
          <Image src={logo} alt="logo" />
          <LogoText>
          Podstar
          </LogoText>
        </Logo>
        <Close onClick={() => setMenuOpen(false)}>
          <CloseRounded />
        </Close>
      </Flex>

      {menuItems.map((item) => (
        <Link key={item.name} to={item.link} style={{ textDecoration: "none" }}>
          <Elements>
            <ContentContainer className="content-container">
              {item.icon}
              <NavText>{item.name}</NavText>
            </ContentContainer>
          </Elements>
        </Link>
      ))}

      <HR />

      {button.map((item) => (
        item.visible && (
          <Elements key={item.name} onClick={item.fun}>
            {item.icon}
            <NavText>{item.name}</NavText>
          </Elements>
        )
      ))}
    </MenuContainer>
  );
};

export default Sidebar;
