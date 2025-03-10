import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { styled } from '@mui/system';
import { Gauge } from '@mui/x-charts/Gauge';
import React from 'react';

const StyledCard = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '12px',
  height: '100%',
}));

const PieChartCard = ({ val1 }) => {
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
            fontSize: '3rem',
          }}
        />
      </Box>
    </StyledCard>
  );
};

export default PieChartCard;
