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

const HistoryIntroCard = () => {
  return (
    <StyledCard variant='outlined'>
      <Typography variant='h2'>
        Welcome to the history page!
      </Typography>
      <Typography variant='h4'>
        Take a look at your past attempts and see how you did.
      </Typography>
    </StyledCard>
  );
};

export default HistoryIntroCard;
