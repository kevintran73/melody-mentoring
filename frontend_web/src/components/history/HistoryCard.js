import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import defaultImg from '../../assets/default-img.png';

const Img = styled('img')({
  margin: '5px',
  width: '100px',
});

const HistoryCard = ({ title, artist, difficulty, date }) => {
  return (
    <Box
      sx={{
        border: '0.1px solid grey',
        padding: 1,
        maxHeight: '125px',
        width: '90%',
        flexGrow: 1,
        margin: '10px 0'
      }}
    >
      <Box display='flex'>
        <Box
          sx={{
            marginRight: '10px'
          }}
        >
          <Img alt='playlist-card' src={defaultImg} />
        </Box>

        <Box>
          <Typography fontSize='1.8rem' component='div'>
            {title}
          </Typography>
          <Typography fontSize='1.2rem'>
            {artist} • {difficulty}
          </Typography>
          <Typography fontSize='1.2rem' marginTop='10px'>
            {date}
          </Typography>
        </Box>

      </Box>
    </Box>
  );
}

export default HistoryCard;
