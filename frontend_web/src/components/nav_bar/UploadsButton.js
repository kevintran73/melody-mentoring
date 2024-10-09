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

const UploadsButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Change colour of button if on uploads page
  let colour = '#B6B6B6';
  if (location.pathname === '/uploads') {
    colour = '#FFFFFF';
  }

  const navCreate = () => {
    return navigate('/uploads');
  };

  return (
    <IconContainer onClick={navCreate}>
      <StyledBook colour={colour} />
      <IconCaption colour={colour}>Uploads</IconCaption>
    </IconContainer>
  );
};

export default UploadsButton;
