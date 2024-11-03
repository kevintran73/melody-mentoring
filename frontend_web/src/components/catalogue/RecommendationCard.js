import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '13vw',
  borderWidth: '2px',
  padding: '12px',
  margin: '10px',
  cursor: 'pointer',
}));

const RecommendationCard = ({ title, thumbnail, composer, privacy }) => {
  return(
    <StyledCard variant='outlined'>
      <Box position="relative">
        <CardMedia
          component='img'
          image={thumbnail}
          alt='img'
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="flex-end"
          color="white"
          fontSize="1rem"
          bgcolor="rgba(0, 0, 0, 0.3)"
        >
          <Typography variant="h5" margin='5px 10px'>{title}</Typography>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default RecommendationCard;
