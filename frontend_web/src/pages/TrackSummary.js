import React from 'react';

import { Box, Typography } from '@mui/material';
import NavBar from '../components/nav_bar/NavBar';
import PieChartCard from '../components/track_summary/PieChartCard'
import SubAdviceCard from '../components/track_summary/SubAdviceCard';
import Thumbnail from '../components/track_summary/Thumbnail';

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

const StyledMainSummary = styled(Box)(() => ({
  borderWidth: '2px',
  padding: '20px',
  margin: '30px',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'red',
}));

const TrackSummary = () => {
  return (
    <Box>
      <NavBar></NavBar>
      <StyledMainSummary>
        <Box flex='4' marginRight='30px'>
          <Typography align='left' variant='h2' margin='10px' marginLeft='20px'>Title</Typography>
          <Box border='solid' height='70%'>
          <Typography variant='h4' margin='10px' marginLeft='20px'>Title</Typography>
          </Box>
        </Box>
        <Box flex='1'>
          <Thumbnail title='September' artist='Earth, Wind & Fire' difficulty='Medium' date='11:07PM Sunday 27 October 2024' />
        </Box>
      </StyledMainSummary>

      <Typography align='left' variant='h4' margin='10px' marginLeft='20px'>Notes</Typography>
      <StyledAdviceBox>
        <PieChartCard />
        <PieChartCard />
        <Box flex={1} height='100%' >
          <SubAdviceCard height="100%" />
        </Box>
      </StyledAdviceBox>

      <Typography align='right' variant='h4' margin='10px' marginRight='20px'>Timing</Typography>
      <StyledAdviceBox>
        <Box flex={1} height='100%' >
          <SubAdviceCard height="100%" />
        </Box>
        <PieChartCard />
        <PieChartCard />
      </StyledAdviceBox>

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
