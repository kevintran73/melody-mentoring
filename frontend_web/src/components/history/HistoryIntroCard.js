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
      <Typography margin='10px' variant='h2' component='div'>{title}</Typography>
      <Typography variant='h4'>Take a look at your past attempts and see how you did</Typography>
    </StyledCard>
  );
};

export default HistoryIntroCard;
