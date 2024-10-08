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

const StyledCard = styled(Card)(() => ({
  minWidth: "200px",
  // width: "15%",
  aspectRatio: "9 / 12.5",
  // minHeight: "280px",
  // height: "30vh",
  borderWidth: "2px",
  // boxShadow: "5px 10px grey",
  padding: "10px",
  paddingBottom: "5px",
  margin: "10px",
}));

const card = (title, img, artist, difficulty) => (
  <React.Fragment>
    <CardMedia
        component="img"
        height="194"
        image={img}
        alt="img"
    />
    <Box padding="2px">
      <Typography variant="h5" component="div">{title}</Typography>
      <Typography sx={{ color: 'text.secondary' }}>{artist}</Typography>
      <Typography sx={{ color: 'text.secondary' }}>{difficulty}</Typography>
    </Box>
  </React.Fragment>
);

const SongCard = ({ title, img, artist, difficulty }) => {
  // const navigate = useNavigate();

  // const navSettings = () => {
  //   return navigate('/settings');
  // };

  return <StyledCard variant="outlined">{card(title, img, artist, difficulty)}</StyledCard>;
};

export default SongCard;
