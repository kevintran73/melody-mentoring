import * as React from 'react';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import defaultImg from '../../assets/default-img.png';

const Img = styled('img')({
  margin: '5px',
  width: '200px',
});

const Thumbnail = ({ title, artist, difficulty, date }) => {
  return (
    <Card
      sx={{
        padding: 1,
        maxHeight: '400px',
        width: '100%',
        flexGrow: 1,
        margin: '10px 0',
        boxShadow: 2,
      }}
    >
      <Box>
        <Box
          sx={{
            marginRight: '10px',
            display:'flex',
            flexDirection: 'column',
            justifyContent:'center',
            alignItems:'center',
          }}
        >
          <Img alt='playlist-card' src={defaultImg} />

          <Typography fontSize='1.8rem' component='div'>
            {title}
          </Typography>
          <Typography fontSize='1.2rem'>
            {artist} • {difficulty}
          </Typography>
          <Typography fontSize='1.2rem'>
            {date}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default Thumbnail;
