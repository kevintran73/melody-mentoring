import React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '17vw',
  borderWidth: '2px',
  padding: '12px',
  height:'100%',
}));

const PieChartCard = ({ val1, name1, val2, name2, val3, name3 }) => {
  const valMissed = 100 - val1;

  return (
    <StyledCard variant='outlined'>
      <Box
        width='100%'
        height='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        <Gauge 
          value={val1} 
          sx={{
            minWidth: '200px',
            height: '100%',
            fontSize: 60,
          }}
        />
      </Box>
    </StyledCard>
  );
};

export default PieChartCard;
