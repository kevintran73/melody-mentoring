import React from 'react';

import { styled } from '@mui/system';

import CatalogueButton from './CatalogueButton';
import NotificationsButton from './NotificationsButton';
import ProfileButton from './ProfileButton';
import CreateButton from './CreateButton';
import HistoryButton from './HistoryButton';
import SettingsButton from './SettingsButton';

const StyledHeader = styled('header')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 1.5rem',
  backgroundColor: '#020E37',
  height: '70px',
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

const NavBar = () => {
  return (
    <StyledHeader>
      <NotificationsButton />

      <MiddleContainer>
        <CreateButton />
        <CatalogueButton />
        <HistoryButton />
      </MiddleContainer>

      <RightContainer>
        <ProfileButton />
        <SettingsButton />
      </RightContainer>
    </StyledHeader>
  );
};

export default NavBar;
