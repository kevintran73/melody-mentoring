import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import React from 'react';

const StyledCard = styled(Card)(() => ({
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '30px',
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: '10px',
}));

const TitleText = styled(Typography)({
  fontSize: 'clamp(34px, 7vw, 60px)',
});

const SubtitleText = styled(Typography)({
  fontSize: 'clamp(20px, 5vw, 30px)',
});

const HistoryIntroCard = () => {
  return (
    <StyledCard variant='outlined'>
      <TitleText>Welcome to the history page!</TitleText>
      <SubtitleText>
        Take a look at your past attempts and see how you did.
      </SubtitleText>
    </StyledCard>
  );
};

export default HistoryIntroCard;
