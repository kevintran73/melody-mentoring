import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import NotificationsIcon from '@mui/icons-material/Notifications';

import { styled } from '@mui/system';

const StyledNotifs = styled(NotificationsIcon)(({ colour }) => ({
  color: colour,
  width: '40px',
  height: '40px',
  cursor: 'pointer',
}));

const NotificationsButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Change colour of button if on notifications page
  let colour = '#B6B6B6';
  if (location.pathname === '/notifications') {
    colour = '#FFFFFF';
  }

  const navNotifs = () => {
    return navigate('/notifications');
  };

  return <StyledNotifs colour={colour} onClick={navNotifs} />;
};

export default NotificationsButton;
