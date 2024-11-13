import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledMainSong = styled(Box)(() => ({
  width: '27vw',
  minWidth: '200px',
  minHeight: '280px',
  borderWidth: '2px',
  padding: '10px',
  marginTop: '85px',
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
  },
});

const PlaylistMainSong = ({ title, img, artist, difficulty, songId }) => {
  const navigate = useNavigate();

  const navExperiment = () => {
    if (songId) {
      return navigate(`/experiment/${songId}`);
    }
  };
  
  return (
    <StyledMainSong>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <img src={img} alt='img' width='95%' height='95%'></img>
        <Box display='flex' flexDirection='column' padding='3px' gap={0.5} alignItems='center' marginTop='10px'>
          <Typography variant='h3' component='div' align='center'>{title}</Typography>
          <Typography variant='h5' sx={{ color: 'text.secondary' }} align='center'>{artist}</Typography>
          <Typography variant='h5' sx={{ color: 'text.secondary' }} align='center'>{difficulty}</Typography>
          <StyledButton onClick={navExperiment}>
              {songId ? 'Start Activity' : 'Select a Song'}
          </StyledButton>
        </Box>
      </Box>
    </StyledMainSong>
  );
};

export default PlaylistMainSong;
