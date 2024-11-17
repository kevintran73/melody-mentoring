import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { BarChart } from '@mui/x-charts/BarChart';
import React from 'react';

const xLabels = ['Pitch'];

const StyledCard = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '12px',
  height: '100%',
  width: '300px',
}));

const BarChartCard = ({ val1 }) => {
  const val4 = val1 - 1;

  let val2 = 1;
  let val3 = -1;

  if (val1 > 1) {
    val2 = 1 - val4;
  } else {
    val3 = 1 - val4;
  }

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
          <Typography>Dragging</Typography>
        </Box>
        <BarChart
          width={300}
          height={600}
          series={[
            { data: [val4], id: 'pvId', stack: 'stack1', color: 'red' },
            { data: [val2], id: 'uvId', stack: 'stack1', color: 'white' },
            { data: [val3], id: 'vvId', stack: 'stack1', color: 'white' },
          ]}
          xAxis={[
            {
              data: xLabels,
              scaleType: 'band',
            },
          ]}
          yAxis={[{ min: -1, max: 1 }]}
          bottomAxis={null}
          leftAxis={{ disableTicks: true }}
        />
      </Box>
    </StyledCard>
  );
};

export default BarChartCard;
