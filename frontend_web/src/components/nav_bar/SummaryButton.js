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

const SummaryButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Change colour of button if on summary page
  let colour = '#B6B6B6';
  if (location.pathname === '/summary') {
    colour = '#FFFFFF';
  }

  const navSummary = () => {
    return navigate('/summary');
  };

  return <StyledPerson colour={colour} onClick={navSummary} />;
};

export default SummaryButton;
