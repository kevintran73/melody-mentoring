import React from 'react';
import Box from '@mui/material/Box';
import AchievementGrid from './AchievementGrid';
import { Typography } from '@mui/material';
import StreakCard from './StreakCard';
import Card from '@mui/material/Card';
import { styled } from '@mui/system';

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
  // gap: '20px',
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
