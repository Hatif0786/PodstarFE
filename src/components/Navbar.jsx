import React, {memo} from 'react';
import styled from 'styled-components';
import { MenuRounded, PersonRounded } from "@mui/icons-material";
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from "../Images/Logo.png";
import "../css/navbar.css";
import { useLocation } from 'react-router-dom';

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
    @media (max-width:768px){
        padding:16px;
    }
`;


const Logo = styled.div`
    color: ${({ theme }) => theme.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-weight: bold;
    font-size: 20px;
    margin: 16px 0px;
    padding-left: 10px;
  `;

const ButtonDiv = styled.div`
    font-size:14px;
    cursor: pointer;
    text-decoration: none;
    max-width: 95px;
    align-items:center;
    color: ${({ theme }) => theme.primary};
    border: 1px solid ${({ theme }) => theme.primary};
    display:flex;
    border-radius:12px;
    gap:8px;
    padding: 8px 10px;
`;

const Image = styled.img`
    height: 40px;
    `;

const IcoButton = styled(IconButton)`
    color: ${({ theme }) => theme.text_secondary} !important;
`;

const Navbar = ({ toggleMenu, setUserlogged, userlogged, menuOpen, setDarkMode, darkMode }) => {
    const location = useLocation();
    const toggle = () => {
        setDarkMode(!darkMode);
    }
    return (
        <NavbarDiv>
            {userlogged&&<IcoButton onClick={toggleMenu}>
                <MenuRounded />
            </IcoButton>}
            <Logo>
                <Image src={logo} alt="logo" />
                Podstar
            </Logo>
            <label className="switch" style={{display:"flex", marginLeft:"auto"}}>
                <input type="checkbox" checked={darkMode} onChange={toggle}/>
                <span className="slider" ></span>
            </label>
            {!userlogged && location.pathname !== '/login' && (
                <ButtonDiv as={Link} to="/login" style={{ display: "flex" }}>
                    <PersonRounded />
                    Login
                </ButtonDiv>
            )}
            {!userlogged && location.pathname !== '/signup' && (
                <ButtonDiv as={Link} to="/signup" style={{ display: "flex", paddingRight: "6.5rem" }}>
                    <PersonRounded />
                    Register
                </ButtonDiv>
            )}
        </NavbarDiv>
    );
}

export default memo(Navbar);
