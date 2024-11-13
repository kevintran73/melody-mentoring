import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

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

const ReviewCard = ({ tutor, feedback, rating }) => {
  return (
    <StyledCard variant='outlined'>
      <Box
        padding='5px'
        display='flex'
        flexDirection='column'
        alignItems='center'
        // justifyContent='center'
        width='400px'
        height='100%'
        gap='20px'
      >
        <Typography fontSize='1.5rem' component='div'>{tutor}</Typography>
        <Typography fontSize='1.4rem' component='div'>{rating} / 5</Typography>
        <Typography fontSize='1.05rem' component='div'>{feedback}</Typography>
      </Box>
    </StyledCard>
  );
};

export default ReviewCard;
