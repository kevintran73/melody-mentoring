import React from 'react';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { styled } from '@mui/system';
import Divider from '@mui/material/Divider';

const xLabels = [
  'Pitch',
];

const StyledCard = styled(Card)(() => ({
  width: '17vw',
  borderWidth: '2px',
  padding: '12px',
  height:'100%',
}));

const BarChartCard = ({ val1 }) => {
  const val4 = val1 -1

  let val2 = 1;
  let val3 = -1;

  if (val1 > 1) {
    val2 = 1 - val4;
  } else {
    val3 = 1 - val4;
  }

  console.log(val4, val2, val3)

  return (
    <StyledCard variant='outlined'>
      <Box
        width='100%'
        height='100%'
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='center'
      >
      <Box
        width='50%'
        height='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        gap='100px'
        marginLeft='10px'
      >
        <Typography>Rushing</Typography>
        {/* <Divider variant="middle" height='100%' width='20px' />
         */}
        <Typography>Dragging</Typography>
      </Box>
      <BarChart
        width={300}
        height={500}
        series={[
          { data: [val4], id: 'pvId', stack: 'stack1', color: 'red' },
          { data: [val2], id: 'uvId', stack: 'stack1', color: 'grey' },
          { data: [val3], id: 'vvId', stack: 'stack1', color: 'grey' },
        ]}
        xAxis={[
          {
            data: xLabels,
            scaleType: 'band',
          },
        ]}
        yAxis={[{ min:-1, max: 1 }]}
        bottomAxis={null}
        // leftAxis={null}
        leftAxis={{ disableTicks: true }}
      />
      </Box>
    </StyledCard>
  );
};

export default BarChartCard;
