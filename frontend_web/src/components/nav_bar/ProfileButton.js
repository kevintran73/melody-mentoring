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

const ProfileButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Change colour of button if on activity page
  let colour = '#B6B6B6';
  if (location.pathname === '/profile') {
    colour = '#FFFFFF';
  }

  const navProfile = () => {
    return navigate('/profile');
  };

  return (
    <StyledPerson
      data-cy='profile_button'
      colour={colour}
      onClick={navProfile}
    />
  );
};

export default ProfileButton;
