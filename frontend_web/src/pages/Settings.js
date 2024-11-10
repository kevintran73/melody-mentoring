import React from 'react';
import { styled } from '@mui/system';

import NavBar from '../components/nav_bar/NavBar';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import Account from '../components/settings/Account';
import Support from '../components/settings/Support';
import Accessibility from '../components/settings/Accessibility';
import TokenContext from '../context/TokenContext';
import { Navigate } from 'react-router-dom';
import LegalInfo from '../components/settings/LegalInfo';

const StyledHeader = styled('h1')({
  fontSize: '2rem',
  marginBottom: '0.5rem',
});

const PageBlock = styled('div')({
  height: 'calc(100vh - 70px - 4rem)',
  margin: '1rem 2.5rem',

  '@media (max-width: 500px)': {
    margin: '0.75rem 1.5rem',
  },
});

const StyledButtonGroup = styled(ButtonGroup)({
  maxWidth: 'calc(100vw - 3rem)',
  display: 'flex',
  flexWrap: 'wrap',
  border: 'none',
  boxShadow: 'none',
});

const StyledButton = styled(Button)({
  backgroundColor: '#404040',
  color: '#ffffff',

  ':hover': {
    backgroundColor: '#515151',
  },

  '@media (max-width: 500px)': {
    padding: '4px 15px',
  },
});

const CategoryBlock = styled('div')({
  height: 'calc(90vh - 70px - 7rem)',
  marginTop: '2rem',
  padding: '1rem 2rem',
  border: '1px solid gray',
  borderRadius: '10px',
  overflowY: 'auto',

  '@media (max-width: 610px)': {
    padding: '0.75rem 1.5rem',
    height: 'calc(90vh - 70px - 9rem)',
  },
});

/**
 * Settings page
 */
const Settings = () => {
  const [settingsCategory, setSettingsCategory] = React.useState('account');

  const { accessToken } = React.useContext(TokenContext);
  if (accessToken == null) {
    return <Navigate to='/login' />;
  }

  return (
    <>
      <NavBar></NavBar>
      <PageBlock>
        <StyledHeader>Settings</StyledHeader>
        <StyledButtonGroup aria-label='Settings navigation bar'>
          <StyledButton onClick={() => setSettingsCategory('account')}>Account</StyledButton>
          <StyledButton onClick={() => setSettingsCategory('accessibility')}>
            Accessibility
          </StyledButton>
          <StyledButton onClick={() => setSettingsCategory('support')}>Support</StyledButton>
          <StyledButton onClick={() => setSettingsCategory('legal')}>
            Legal Information
          </StyledButton>
        </StyledButtonGroup>
        <CategoryBlock>
          {settingsCategory === 'account' && <Account />}
          {settingsCategory === 'accessibility' && <Accessibility />}
          {settingsCategory === 'support' && <Support />}
          {settingsCategory === 'legal' && <LegalInfo />}
        </CategoryBlock>
      </PageBlock>
    </>
  );
};

export default Settings;
