import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

import { styled } from '@mui/system';

const IconContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledMusic = styled(LibraryMusicIcon)(({ colour }) => ({
  color: colour,
  width: '32px',
  height: '32px',
}));

const IconCaption = styled('p')(({ colour }) => ({
  fontSize: '0.75rem',
  color: colour,
  margin: '0',
}));

const CatalogueButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Change colour of button if on catalogue page
  let colour = '#B6B6B6';
  if (location.pathname === '/catalogue') {
    colour = '#FFFFFF';
  }

  const navCatalogue = () => {
    return navigate('/catalogue');
  };

  return (
    <IconContainer onClick={navCatalogue}>
      <StyledMusic colour={colour} />
      <IconCaption colour={colour}>Catalogue</IconCaption>
    </IconContainer>
  );
};

export default CatalogueButton;
