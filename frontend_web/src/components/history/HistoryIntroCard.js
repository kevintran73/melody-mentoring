import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '12px',
  paddingBottom: '5px',
  width: '100%',
  flexGrow: 1,
  height:'100%',
}));

const card = ( title ) => (
  <Box>
    <Box padding='15px'>
      <Typography variant='h3' component='div' paddingBotom='10px'>{title}</Typography>
      <Typography variant='h5'>You've been doing consistently well over the past few days!</Typography>
      {/* <Typography fontSize='0.8rem' sx={{ color: 'text.secondary' }}>Test2</Typography> */}
    </Box>
  </Box>
);

const HistoryIntroCard = ({ title }) => {
  return (
    <StyledCard variant='outlined'>{card(title)}</StyledCard>
  );
};

export default HistoryIntroCard;
