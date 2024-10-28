import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '12px',
  paddingBottom: '5px',
  height:'100%',
  display:'flex',
  justifyContent:'space-evenly',
  alignItems:'center',
  alignContent:'space-evenly',
  textAlign:'center',
  // gap:'10px',
}));

const SubAdviceCard = ({ main, details, tips }) => {
  return (
    <StyledCard variant='outlined'>
      <Box
        padding='2px'
        display='flex'
        flexDirection='column'
        justifyContent='space-evenly'
        height='100%'
        // gap='10px'
      >
        {/* The overview of how they went */}
        <Typography fontSize='1.1rem' component='div'>{main}</Typography>
        <Divider variant="middle" />

        {/* More details added and/or include their left vs. right hand */}
        <Typography fontSize='1rem'>{details}</Typography>
        <Divider variant="middle" />

        {/* Tips for them to improve */}
        <Typography fontSize='1rem'>{tips}</Typography>
      </Box>
    </StyledCard>
  );
};

export default SubAdviceCard;
