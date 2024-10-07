import React from 'react';
import { useNavigate } from 'react-router-dom';

import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

import { styled } from '@mui/system';

const IconContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledMusic = styled(LibraryMusicIcon)({
  color: '#ffffff',
  width: '32px',
  height: '32px',
});

const IconCaption = styled('p')({
  fontSize: '0.75rem',
  color: '#ffffff',
  margin: '0',
});

const CatalogueButton = () => {
  const navigate = useNavigate();

  const navCatalogue = () => {
    return navigate('/catalogue');
  };

  return (
    <IconContainer onClick={navCatalogue}>
      <StyledMusic />
      <IconCaption>Catalogue</IconCaption>
    </IconContainer>
  );
};

export default CatalogueButton;
