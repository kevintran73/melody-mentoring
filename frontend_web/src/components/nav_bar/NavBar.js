import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import React from 'react';
import TokenContext from '../../context/TokenContext';
import CatalogueButton from './CatalogueButton';
import CreateButton from './CreateButton';
import HistoryButton from './HistoryButton';
import ProfileButton from './ProfileButton';
import RequestButton from './RequestButton';
import SettingsButton from './SettingsButton';
import StudentsButton from './StudentButton';

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

  '@media (max-width: 500px)': {
    padding: '1rem 0.75rem',
  },
}));

const MiddleContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px',

  '@media (max-width: 500px)': {
    gap: '15px',
  },
});

const RightContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',

  '@media (max-width: 500px)': {
    gap: '2px',
  },
});

const NavBar = ({ isDisabled = false, ...props }) => {
  const { role } = React.useContext(TokenContext);

  return (
    <StyledHeader isDisabled={isDisabled} {...props}>
      <Box width='100px' />

      <MiddleContainer>
        {role === 'student' && (
          <>
            <CreateButton />
            <CatalogueButton />
            <HistoryButton />
          </>
        )}
        {role === 'tutor' && (
          <>
            <StudentsButton />
            <RequestButton />
          </>
        )}
      </MiddleContainer>

      <RightContainer>
        <ProfileButton />
        <SettingsButton />
      </RightContainer>
    </StyledHeader>
  );
};

export default NavBar;
