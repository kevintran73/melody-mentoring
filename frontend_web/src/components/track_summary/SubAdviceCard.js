import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '12px',
  paddingBottom: '5px',
  height:'100%',
}));

const card = () => (
  <Box>
    <Box padding='2px'>
      <Typography fontSize='1rem' component='div'>Title</Typography>
      <Typography fontSize='0.9rem' sx={{ color: 'text.secondary' }}>Test</Typography>
      <Typography fontSize='0.8rem' sx={{ color: 'text.secondary' }}>Test2</Typography>
    </Box>
  </Box>
);

const SubAdviceCard = ({  }) => {
  return (
    <StyledCard variant='outlined'>{card()}</StyledCard>
  );
};

export default SubAdviceCard;
