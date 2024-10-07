import React from 'react';

import NotificationsIcon from '@mui/icons-material/Notifications';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import { styled } from '@mui/system';
import CatalogueButton from './CatalogueButton';

const StyledHeader = styled('header')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 1.5rem',
  backgroundColor: '#020E37',
  height: '40px',
});

const StyledNotifs = styled(NotificationsIcon)({
  color: '#ffffff',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
});

const StyledCam = styled(CameraAltIcon)({
  color: '#ffffff',
  width: '32px',
  height: '32px',
});

const StyledBook = styled(MenuBookIcon)({
  position: 'relative',
  color: '#ffffff',
  width: '32px',
  height: '32px',
  top: '-2px',
});

const StyledPerson = styled(PersonIcon)({
  color: '#ffffff',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
});

const StyledSettings = styled(SettingsIcon)({
  color: '#ffffff',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
});

const MiddleContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px',
});

const RightContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
});

const IconContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
});

const IconCaption = styled('p')({
  fontSize: '0.75rem',
  color: '#ffffff',
  margin: '0',
});

const NavBar = () => {
  return (
    <StyledHeader>
      <StyledNotifs />

      <MiddleContainer>
        <IconContainer>
          <StyledCam />
          <IconCaption>Create</IconCaption>
        </IconContainer>
        <CatalogueButton />
        <IconContainer>
          <StyledBook />
          <IconCaption>Uploads</IconCaption>
        </IconContainer>
      </MiddleContainer>

      <RightContainer>
        <StyledPerson />
        <StyledSettings />
      </RightContainer>
    </StyledHeader>
  );
};

export default NavBar;
