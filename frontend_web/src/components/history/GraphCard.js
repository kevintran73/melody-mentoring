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
  borderRadius: '16px',
}));

const card = () => (
  <Box>
    <Box padding='2px'>
      <Typography variant='h3' component='div'>Statistics</Typography>
      {/* <Typography fontSize='0.9rem' sx={{ color: 'text.secondary' }}>Test</Typography>
      <Typography fontSize='0.8rem' sx={{ color: 'text.secondary' }}>Test2</Typography> */}
    </Box>
  </Box>
);

const GraphCard = ({  }) => {
  return (
    <StyledCard variant='outlined'>{card()}</StyledCard>
  );
};

export default GraphCard;
