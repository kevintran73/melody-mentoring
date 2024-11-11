import React, { useEffect, useState } from 'react';

import { styled } from '@mui/system';

import CatalogueButton from './CatalogueButton';
import NotificationsButton from './NotificationsButton';
import SummaryButton from './SummaryButton';
import SettingsButton from './SettingsButton';
import CreateButton from './CreateButton';
import UploadsButton from './UploadsButton';
import StudentsButton from './StudentButton';
import TokenContext from '../../context/TokenContext';
import axios from 'axios';
import { showErrorMessage } from '../../helpers';

const StyledHeader = styled('header')(({ isDisabled }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 1.5rem',
  backgroundColor: '#020E37',
  height: '70px',

  ...(isDisabled && {
    pointerEvents: 'none',
  }),
}));

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

const NavBar = ({ isDisabled = false, ...props }) => {

  const { role } = React.useContext(TokenContext);


  return (
    <StyledHeader isDisabled={isDisabled} {...props}>
      <NotificationsButton />

      <MiddleContainer>
        <CreateButton />
        {role === 'student' && <>
          <CatalogueButton />
          <UploadsButton />
        </>}
        {role === 'lecturer' && <>
          <StudentsButton />
        </>}

      </MiddleContainer>

      <RightContainer>
      {role === 'student' && <>
        <SummaryButton />
      </>}
        <SettingsButton />
      </RightContainer>
    </StyledHeader>
  );
};

export default NavBar;
