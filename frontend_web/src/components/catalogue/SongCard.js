import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import defaultImg from '../../assets/default-img.png';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '150px',
  height: '240px', 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '12px',
  paddingBottom: '5px',
  margin: '10px',
  marginRight: '15px',
  cursor: 'pointer',
}));

const SongCard = ({ title, thumbnail, composer, difficulty, privacy, genreTags }) => {
  return(
    <StyledCard variant='outlined'>
      <CardMedia
        component='img'
        height='150'
        image={thumbnail ? thumbnail : defaultImg}
        alt='img'
      />
      <Box padding='2px' textAlign='center'>
        <Typography fontSize='1rem' component='div'>{title}</Typography>
        <Typography fontSize='0.9rem' sx={{ color: 'text.secondary' }}>{composer ? composer : 'Unknown'}</Typography>
        <Typography fontSize='0.8rem' sx={{ color: 'text.secondary' }}>Difficulty: {difficulty}</Typography>
        {/* <Typography fontSize='0.8rem' sx={{ color: 'text.secondary' }}>Privacy: {privacy ? 'Private' : 'Public'}</Typography> */}
        {/* <Typography fontSize='0.8rem' sx={{ color: 'text.secondary' }}>Genre Tags: {createTagStrings(genreTags)}</Typography> */}
      </Box>
    </StyledCard>
  );
};

export default SongCard;
