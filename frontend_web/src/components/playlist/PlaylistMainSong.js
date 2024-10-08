import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledMainSong = styled(Box)(() => ({
  // width: "25vw",
  minWidth: "200px",
  // height: "25vw", 
  minHeight: "280px",
  borderWidth: "2px",
  // boxShadow: "5px 10px grey",
  padding: "10px",
  paddingTop: "50px",
}));

const songInfo = (title, img, artist, difficulty) => (
  <Box>
    <img src={img} alt="img" width="500px" height="500px"></img>
    <Box display="flex" flexDirection="column" padding="3px" gap={0.5}>
      <Typography variant="h2" component="div" align="center">{title}</Typography>
      <Typography variant="h4" sx={{ color: 'text.secondary' }} align="center">{artist}</Typography>
      <Typography variant="h4" sx={{ color: 'text.secondary' }} align="center">{difficulty}</Typography>
      <Button
        variant="contained"
        sx={{ borderRadius: '16px' }}
        >
          Click Me
      </Button>
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
