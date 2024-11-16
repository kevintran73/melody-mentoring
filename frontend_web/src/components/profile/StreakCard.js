import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import streaksIcon from '../../assets/streaks_icon.png';

const Image = ({ img }) => {
  return (
    <Box
      component='img'
      src={img}
      alt='test'
      sx={{
        width: '100px',
        objectFit: 'cover',
      }}
    />
  );
};

const StreakCard = ({ userInfo }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      spacing={2}
      justifyContent='center'
      alignItems='center'
      width='100%'
    >
      <Box
        sx={{
          width: '100%',
          objectFit: 'cover',
          padding: '10px',
          textAlign: 'center',
          boxShadow: 3,
          borderRadius: '16px',
          // margin: '10px',
        }}
      >
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          margin='0px 10px 10px 10px'
        >
          <Image img={streaksIcon} />
          <Typography
            sx={{
              fontSize: '1.3rem',
              '@media (max-width: 1000px)': {
                fontSize: '2.5vw',
              },
            }}
            // fontSize={'clamp(20px, 1.3rem, 50px)'}
            variant='primary'
          >
            You've been on a streak of {userInfo['current_streak']} days!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StreakCard;
