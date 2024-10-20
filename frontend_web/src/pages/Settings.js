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
});

const CategoryBlock = styled('div')({
  height: '85%',
  marginTop: '2rem',
  padding: '1rem 2rem',
  border: '1px solid gray',
  borderRadius: '10px',
  overflowY: 'auto',
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
        <ButtonGroup>
          <Button onClick={() => setSettingsCategory('account')}>Account</Button>
          <Button onClick={() => setSettingsCategory('accessibility')}>Accessibility</Button>
          <Button onClick={() => setSettingsCategory('support')}>Support</Button>
          <Button onClick={() => setSettingsCategory('legal')}>Legal Information</Button>
        </ButtonGroup>
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
