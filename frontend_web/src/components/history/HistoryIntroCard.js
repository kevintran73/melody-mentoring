import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '30px',
  width: '100%',
  flexGrow: 1,
  height:'100%',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
}));

const HistoryIntroCard = ({ title }) => {
  return (
    <StyledCard variant='outlined'>
      <Typography variant='h3' component='div'>{title}</Typography>
      <Typography variant='h5'>You've been doing consistently well over the past few days!</Typography>
    </StyledCard>
  );
};

export default HistoryIntroCard;
