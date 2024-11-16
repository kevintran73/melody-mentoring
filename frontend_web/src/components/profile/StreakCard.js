import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import streaksIcon from '../../assets/streaks_icon.png';
import Card from '@mui/material/Box';

const Image = ({ img }) => {
  return (
    <Box
      component='img'
      src={img}
      alt='test'
      sx={{
        width: '10vw',
        objectFit: 'cover',
      }}
    />
  );
};

const StreakCard = ({ userInfo }) => {
  return (
    <Box
      display='flex'
      width='100%'
      height='100%'
      padding='15px'
      textAlign='center'
      alignItems='center'
      justifyContent='center'
      boxShadow={3}
      borderRadius='16px'
      flexDirection='column'
    >
      <Image img={streaksIcon} />
      <Typography
        sx={{
          fontSize: '1.6rem',
          '@media (max-width: 1000px)': {
            fontSize: '2.5vw',
          },
        }}
        variant='primary'
      >
        You've been on a streak of {userInfo['current_streak']} days!
      </Typography>
    </Box>
  );
};

export default StreakCard;
