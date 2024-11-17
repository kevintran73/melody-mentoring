import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import streaksIcon from '../../assets/streaks_icon.png';

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

const StyledCard = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  height: '100%',
  padding: '15px',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',

  borderRadius: '16px',
  flexDirection: 'column',
}));

const StreakCard = ({ userInfo }) => {
  return (
    <StyledCard boxShadow={3}>
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
    </StyledCard>
  );
};

export default StreakCard;
