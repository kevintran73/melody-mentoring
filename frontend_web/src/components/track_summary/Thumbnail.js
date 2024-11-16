import * as React from 'react';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import defaultImg from '../../assets/default-img.png';

const Img = styled('img')({
  margin: '5px',
  width: '200px',
  borderRadius: '8px',
});

const Thumbnail = ({ title, thumbnail, composer, difficulty, date }) => {
  return (
    <Card
      sx={{
        padding: 1,
        height: '100%',
        maxHeight: '400px',
        width: '100%',
        minWidth: '150px',
        flexGrow: 1,
        margin: '10px 0',
        boxShadow: 2,
        borderRadius: '16px',
        textAlign: 'center',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Img alt='playlist-card' src={thumbnail ? thumbnail : defaultImg} />

          <Typography fontSize='1.6rem' component='div'>
            {title}
          </Typography>
          <Typography fontSize='1.1rem'>{composer}</Typography>
          <Typography fontSize='1.1rem'>Difficulty: {difficulty}</Typography>
          <Typography fontSize='1.1rem'>{date}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default Thumbnail;
