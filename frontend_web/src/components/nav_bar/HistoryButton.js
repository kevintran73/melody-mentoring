import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import MenuBookIcon from '@mui/icons-material/MenuBook';

import { styled } from '@mui/system';

const IconContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledBook = styled(MenuBookIcon)(({ colour }) => ({
  color: colour,
  width: '32px',
  height: '32px',
}));

const IconCaption = styled('p')(({ colour }) => ({
  fontSize: '0.75rem',
  color: colour,
  margin: '0',
}));

const HistoryButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Change colour of button if on history page
  let colour = '#B6B6B6';
  if (location.pathname === '/history') {
    colour = '#FFFFFF';
  }

  const navCreate = () => {
    return navigate('/history');
  };

  return (
    <IconContainer onClick={navCreate} data-cy='history_button'>
      <StyledBook colour={colour} />
      <IconCaption colour={colour}>History</IconCaption>
    </IconContainer>
  );
};

export default HistoryButton;
