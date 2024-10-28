import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import defaultImg from '../../assets/default-img.png';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '100%',
  // minWidth: '150px',
  height: '100%', 
  // minHeight: '220px',
  borderWidth: '2px',
  // boxShadow: '5px 10px grey',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  padding: '5%' ,
  backgroundColor: 'green',
}));

const StyledButton = styled(Button)({
  width: '75%',
  backgroundColor: '#020E37',
  color:'white',
  fontSize: '1.3rem',
  padding: '8px 8px',
  textTransform: 'none',
  borderRadius: '16px',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: 'blue',
    // borderColor: '#0062cc',
    // boxShadow: 'none',
  },
});

const SongCard = () => {
  // const navigate = useNavigate();

  // const navSettings = () => {
  //   return navigate('/settings');
  // };

  return (
    <StyledCard variant='outlined'>
      <Box
        component="img"
        src={defaultImg}
        alt='test'
        sx={{
          width: '100%',
          // height: '100%',
          objectFit: 'cover',
        }}
      />
      <Box padding='20px'>
        <Typography fontSize='2rem' component='div'>Name</Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Date Joined: 10th September 2024</Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Instruments: Piano</Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Australian </Typography>
      </Box>
      <StyledButton> Change Profile </StyledButton>
    </StyledCard>
  );
};

export default SongCard;
