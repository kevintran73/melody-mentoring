import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import PersonIcon from '@mui/icons-material/Person';

import { styled } from '@mui/system';

const StyledPerson = styled(PersonIcon)(({ colour }) => ({
  color: colour,
  width: '40px',
  height: '40px',
  cursor: 'pointer',
}));

const ActivityButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Change colour of button if on activity page
  let colour = '#B6B6B6';
  if (location.pathname === '/activity') {
    colour = '#FFFFFF';
  }

  const navActivity = () => {
    return navigate('/activity');
  };

  return <StyledPerson colour={colour} onClick={navActivity} />;
};

export default ActivityButton;
