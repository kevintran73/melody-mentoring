import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '350px',
  borderWidth: '2px',
  padding: '12px',
  height:'100%',
}));

const card = () => (
  <Box>
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
            { id: 3, value: 55, label: 'series D' },
          ],
          innerRadius: 50,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: 0,
          endAngle: 360,
          cx: 100,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 40, additionalRadius: -10 },
        }
      ]}
      width={210}
      height={200}
      slotProps={{ legend: { hidden: true } }}
    />
    <Box padding='2px'>
      <Typography fontSize='1rem' component='div'>Title</Typography>
      <Typography fontSize='0.9rem' sx={{ color: 'text.secondary' }}>Test</Typography>
      <Typography fontSize='0.8rem' sx={{ color: 'text.secondary' }}>Test2</Typography>
    </Box>
  </Box>
);

const PieChartCard = ({  }) => {
  return (
    <StyledCard variant='outlined'>{card()}</StyledCard>
  );
};

export default PieChartCard;
