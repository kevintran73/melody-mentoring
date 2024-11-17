import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { styled } from '@mui/system';

const IconContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledMusic = styled(GroupAddIcon)(({ colour }) => ({
  color: colour,
  width: '32px',
  height: '32px',
}));

const IconCaption = styled('p')(({ colour }) => ({
  fontSize: '0.75rem',
  color: colour,
  margin: '0',
}));

const RequestButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Change colour of button if on dashboard page
  let colour = '#B6B6B6';
  if (location.pathname === '/students') {
    colour = '#FFFFFF';
  }
  const navCatalogue = () => {
    return navigate('/students');
  };
  return (
    <IconContainer onClick={navCatalogue} data-cy='students-button'>
      <StyledMusic colour={colour} />
      <IconCaption colour={colour}>Students</IconCaption>
    </IconContainer>
  );
};
export default RequestButton;
