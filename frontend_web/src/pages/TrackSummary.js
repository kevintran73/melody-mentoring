import React from 'react';

import { Box, Typography } from '@mui/material';
import NavBar from '../components/nav_bar/NavBar';
import PieChartCard from '../components/track_summary/PieChartCard'
import SubAdviceCard from '../components/track_summary/SubAdviceCard';

import { styled } from '@mui/system';

/**
 * Track Summary page
 */

const StyledAdviceBox = styled(Box)(() => ({
  borderWidth: '2px',
  padding: '20px',
  margin: '10px',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'red',
  gap: '30px',
  height: '450px',
}));

const TrackSummary = () => {
  return (
    <Box>
      <NavBar></NavBar>
      <Box>

      </Box>

      <Typography align='left' variant='h4' margin='10px' marginLeft='20px'>Notes</Typography>
      <StyledAdviceBox>
        <PieChartCard />
        <PieChartCard />
        <Box flex={1} height='100%' >
          <SubAdviceCard height="100%" />
        </Box>
      </StyledAdviceBox>

      <Typography align='right' variant='h4' margin='10px' marginRight='20px'>Timing</Typography>
      <Box display='flex' flexDirection={'row'}>
        <SubAdviceCard />
        <PieChartCard />
        <PieChartCard />
      </Box>

      Note Types
      <Box display='flex' flexDirection={'row'}>
        <PieChartCard />
        <PieChartCard />
        <SubAdviceCard />
      </Box>

      Dynamics
      <Box display='flex' flexDirection={'row'}>
        <SubAdviceCard />
        <PieChartCard />
        <PieChartCard />
      </Box>

      Articulation
      <Box display='flex' flexDirection={'row'}>
        <PieChartCard />
        <PieChartCard />
        <SubAdviceCard />
      </Box>
    </Box>
  );
};

export default TrackSummary;
