import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { styled } from '@mui/system';
import React from 'react';
import AchievementGrid from './AchievementGrid';
import StreakCard from './StreakCard';

const StyledAchievements = styled(Box)(() => ({
  width: '90%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  gap: '20px',

  '@media (max-width: 1000px)': {
    flexDirection: 'row',
    gap: '25px',
  },
}));

const StyledCard = styled(Card)(() => ({
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '100%',
  borderRadius: '16px',
  padding: '12px',
}));

/**
 * Achievement card component
 */
const AchievementCard = ({ profileInfo }) => {
  return (
    <StyledCard>
      <Typography fontSize='3.6vw'> Achievements </Typography>
      <StyledAchievements>
        {profileInfo['current_streak'] && (
          <StreakCard userInfo={profileInfo}></StreakCard>
        )}
        {profileInfo['achievements'] && (
          <AchievementGrid userInfo={profileInfo}></AchievementGrid>
        )}
      </StyledAchievements>
    </StyledCard>
  );
};

export default AchievementCard;
