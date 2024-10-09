import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SettingsIcon from '@mui/icons-material/Settings';

import { styled } from '@mui/system';

const StyledSettings = styled(SettingsIcon)(({ colour }) => ({
  color: colour,
  width: '40px',
  height: '40px',
  cursor: 'pointer',
}));

const SettingsButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Change colour of button if on settings page
  let colour = '#B6B6B6';
  if (location.pathname === '/settings') {
    colour = '#FFFFFF';
  }

  const navSettings = () => {
    return navigate('/settings');
  };

  return <StyledSettings colour={colour} onClick={navSettings} />;
};

export default SettingsButton;
