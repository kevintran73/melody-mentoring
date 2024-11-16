import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '12px',
  paddingBottom: '5px',
  height: '100%',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  alignContent: 'space-evenly',
  textAlign: 'center',
  backgroundColor: 'white',
  overflowY: 'auto',
}));

const SubAdviceCard = ({ details }) => {
  return (
    <StyledCard variant='outlined'>
      <Box
        padding='5px'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        width='100%'
        height='100%'
      >
        <Typography fontSize='1.2rem' component='div'>
          {details}
        </Typography>
      </Box>
    </StyledCard>
  );
};

export default SubAdviceCard;
