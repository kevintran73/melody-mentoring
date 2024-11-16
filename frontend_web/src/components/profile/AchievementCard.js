import React from 'react';
import Box from '@mui/material/Box';
import AchievementGrid from './AchievementGrid';
import { Typography } from '@mui/material';
import StreakCard from './StreakCard';
import Card from '@mui/material/Card';
import { styled } from '@mui/system';

const StyledAchievements = styled(Box)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',

  // '@media (max-width: 1000px)': {
  //   flexDirection: 'row',
  //   // margin: '2vw 20vw',
  // },
}));

/**
 * Achievement card component
 */
const AchievementCard = ({ profileInfo }) => {
  return (
    <Box
      flex={1}
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      height='100%'
    >
      <Card
        sx={{
          borderRadius: '16px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <Typography variant='h3'> Achievements </Typography>
        <StyledAchievements>
          {profileInfo['current_streak'] && (
            <StreakCard flex={1} userInfo={profileInfo}></StreakCard>
          )}
          {profileInfo['achievements'] && (
            <AchievementGrid flex={1} userInfo={profileInfo}></AchievementGrid>
          )}
        </StyledAchievements>
      </Card>
    </Box>
  );
};

export default AchievementCard;
