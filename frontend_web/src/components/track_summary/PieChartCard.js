import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '150px',
  // minWidth: '150px',
  height: '220px', 
  // minHeight: '220px',
  borderWidth: '2px',
  // boxShadow: '5px 10px grey',
  padding: '12px',
  paddingBottom: '5px',
  margin: '10px',
  marginRight: '15px',
  cursor: 'pointer',
}));

const card = () => (
  <Box>
    {/* <CardMedia
        component='img'
        height='150'
        image={img}
        alt='img'
    /> */}
    {/* <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
          innerRadius: 30,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -45,
          endAngle: 225,
          cx: 150,
          cy: 150,
        }
      ]}
    /> */}
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
