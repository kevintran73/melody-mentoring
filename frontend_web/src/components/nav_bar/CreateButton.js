import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import CameraAltIcon from '@mui/icons-material/CameraAlt';

import { styled } from '@mui/system';

const IconContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledCamera = styled(CameraAltIcon)(({ colour }) => ({
  color: colour,
  width: '32px',
  height: '32px',
}));

const IconCaption = styled('p')(({ colour }) => ({
  fontSize: '0.75rem',
  color: colour,
  margin: '0',
}));

const CreateButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Change colour of button if on create page
  let colour = '#B6B6B6';
  if (location.pathname === '/create') {
    colour = '#FFFFFF';
  }

  const navCreate = () => {
    return navigate('/create');
  };

  return (
    <IconContainer onClick={navCreate}>
      <StyledCamera colour={colour} />
      <IconCaption colour={colour}>Create</IconCaption>
    </IconContainer>
  );
};

export default CreateButton;
