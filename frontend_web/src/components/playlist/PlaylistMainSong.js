import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledMainSong = styled(Box)(() => ({
  // width: '25vw',
  minWidth: '200px',
  // height: '25vw', 
  minHeight: '280px',
  borderWidth: '2px',
  // boxShadow: '5px 10px grey',
  padding: '10px',
  paddingTop: '50px',
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

const songInfo = (title, img, artist, difficulty) => (
  <Box marginTop='15%'>
    <img src={img} alt='img' width='500px' height='500px'></img>
    <Box display='flex' flexDirection='column' padding='3px' gap={0.5} alignItems='center' marginTop='10px'>
      <Typography variant='h3' component='div' align='center'>{title}</Typography>
      <Typography variant='h5' sx={{ color: 'text.secondary' }} align='center'>{artist}</Typography>
      <Typography variant='h5' sx={{ color: 'text.secondary' }} align='center'>{difficulty}</Typography>
      <StyledButton>
          Start Activity
      </StyledButton>
    </Box>
  </Box>
);

const PlaylistMainSong = ({ title, img, artist, difficulty }) => {
  // const navigate = useNavigate();

  // const navSettings = () => {
  //   return navigate('/settings');
  // };

  return <StyledMainSong>{songInfo(title, img, artist, difficulty)}</StyledMainSong>;
};

export default PlaylistMainSong;
