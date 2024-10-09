import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '150px',
  // minWidth: '150px',
  height: '220px', 
  // minHeight: '220px',
  borderWidth: '2px',
  // boxShadow: '5px 10px grey',
  padding: '12px',
  paddingBottom: '5px',
  margin: '10px',
  marginRight: '15px',
  cursor: 'pointer',
}));

const card = (title, img, artist, difficulty) => (
  <Box>
    <CardMedia
        component='img'
        height='150'
        image={img}
        alt='img'
    />
    <Box padding='2px'>
      <Typography fontSize='1rem' component='div'>{title}</Typography>
      <Typography fontSize='0.9rem' sx={{ color: 'text.secondary' }}>{artist}</Typography>
      <Typography fontSize='0.8rem' sx={{ color: 'text.secondary' }}>{difficulty}</Typography>
    </Box>
  </Box>
);

const SongCard = ({ title, img, artist, difficulty }) => {
  // const navigate = useNavigate();

  // const navSettings = () => {
  //   return navigate('/settings');
  // };

  return <StyledCard variant='outlined'>{card(title, img, artist, difficulty)}</StyledCard>;
};

export default SongCard;
