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
  backgroundColor:'white',
}));

const SubAdviceCard = ({ details }) => {
  return (
    <StyledCard variant='outlined'>
      <Box
        padding='2px'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        height='100%'
      >
        <Typography fontSize='1.05rem' component='div'>{details}</Typography>
      </Box>
    </StyledCard>
  );
};

export default SubAdviceCard;
