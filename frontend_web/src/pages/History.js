import React, { useEffect, useState } from 'react';
import NavBar from '../components/nav_bar/NavBar';
import Box from '@mui/material/Box';
import HistoryCard from '../components/history/HistoryCard';
import GraphCard from '../components/history/GraphCard';
import { TextField, Typography } from '@mui/material';
import HistoryIntroCard from '../components/history/HistoryIntroCard';
import { styled } from '@mui/system';

/**
 * Uploads page
 */

const StyledTopContainer = styled(Box)(() => ({
  display:'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  margin: '2vw 10vw',
  height: '20vw',
  gap: '1vw',
}));

const History = () => {
  return (
    <>
      <NavBar></NavBar>
      <StyledTopContainer>
        <Box flex='5' height='100%'>
          <GraphCard />
        </Box>
        <Box flex='2' height='100%'>
          <HistoryIntroCard title='Fantastic work!' />
        </Box>
      </StyledTopContainer>
      
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' marginX='10vw'>
        <TextField 
          sx={{
            // marginX: '10vw',
            width: '100%',
            marginBottom: '30px',
          }}
          id='outlined-basic' label='Search' variant='outlined'
        />
        <HistoryCard title='September' artist='Earth, Wind & Fire' difficulty='Medium' date='11:07PM Sunday 27 October 2024'/>
        <HistoryCard title='test' artist='test' difficulty='test' date='test'/>
        <HistoryCard title='test' artist='test' difficulty='test' date='test'/>
        <HistoryCard title='test' artist='test' difficulty='test' date='test'/>
        <HistoryCard title='test' artist='test' difficulty='test' date='test'/>
      </Box>
    </>
  );
};

export default History;
