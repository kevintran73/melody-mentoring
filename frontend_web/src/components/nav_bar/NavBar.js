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

  const [role, setRole] = React.useState(null)
  const { userId, accessToken } = React.useContext(TokenContext);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Attach token to the headers
          },
        });
        setRole(response.data.role)  // get the role of the user and render the components accordingly
      } catch (err) {
        showErrorMessage(err.response.data.error);
      }
    }
    fetchData()
  }, []);

  return (
    <StyledHeader>
      <NotificationsButton />

      <MiddleContainer>
        {role === 'student' && <>
          <CreateButton />
          <CatalogueButton />
          <UploadsButton />
        </>}
        {role === 'tutor' && <>
          <StudentsButton />
        </>}

      </MiddleContainer>

      <RightContainer>
        <SummaryButton />
        <SettingsButton />
      </RightContainer>
    </StyledHeader>
  );
};

export default NavBar;
