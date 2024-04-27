import React from 'react'
import styled from 'styled-components'
import {MenuRounded, PersonRounded} from "@mui/icons-material";
import { IconButton } from '@mui/material';

const NavbarDiv = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px 40px;
    align-items: center;
    gap: 30px;
    color: ${({theme}) => theme.text_primary}
    background: ${({theme}) => theme.bgLight}
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.7px);
    -webkit-backdrop-filter: blur(5.7px)
    @media (max-width:768px){
        padding:16px;
    }
`;

const ButtonDiv = styled.div`
    font-size:14px;
    cursor: pointer;
    text-decoration: none;
    max-width: 70px;
    align-items:center;
    color: ${({theme}) => theme.primary};
    border: 1px solid ${({theme}) => theme.primary};
    display:flex;
    border-radius:12px;
    gap:8px;
    padding: 8px 10px;
`;


const IcoButton = styled(IconButton)`
    color: ${({theme}) => theme.text_secondary} !important;
`;

const Navbar = ({setMenuOpen, menuOpen}) => {
  return (
    <NavbarDiv>
        <IcoButton onClick={() => setMenuOpen(!menuOpen)}>
            <MenuRounded />
        </IcoButton>
        <ButtonDiv>
            <PersonRounded/>
            Login
        </ButtonDiv>
    </NavbarDiv>
  )
}

export default Navbar