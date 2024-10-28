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

const PieChartCard = ({ val1, name1, val2, name2, val3, name3 }) => {
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
        <PieChart
          sx={{
            transform: 'scale(1)',
            transformOrigin: 'center',
            backgroundColor: 'blue',
            width: '100%',
            height: '100%',
          }}
          series={[
            {
              data: [
                { id: 0, value: val1, label: name1 },
                { id: 1, value: val2, label: name2 },
                { id: 2, value: val3, label: name3 },
              ],
              innerRadius: 50,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 5,
              cx: 100,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 40, additionalRadius: -10 },
            },
          ]}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
        <Box padding='2px' textAlign='center'>
          <Typography fontSize='1rem' component='div'>{name1} - {val1}%</Typography>
          <Typography fontSize='1' sx={{ color: 'text.secondary' }}>{name2} - {val2}%</Typography>
          <Typography fontSize='1' sx={{ color: 'text.secondary' }}>{name3} - {val3}%</Typography>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default PieChartCard;
