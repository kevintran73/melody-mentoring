import React from 'react';

import { Box, Typography } from '@mui/material';
import NavBar from '../components/nav_bar/NavBar';
import PieChartCard from '../components/track_summary/PieChartCard'
import SubAdviceCard from '../components/track_summary/SubAdviceCard';
import Thumbnail from '../components/track_summary/Thumbnail';
import ScrollContainer from 'react-indiana-drag-scroll';

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

      <ScrollContainer
            hideScrollbars={false}      // Shows the scrollbars for normal scrolling
            vertical={true}             // Enables vertical scrolling
            horizontal={true}           // Enables horizontal scrolling
            activationDistance={5}      // Set a small distance to activate drag
            ignoreElements=".no-drag"
      >
      <Box display='flex' flexDirection='row' justifyContent='space-evenly' backgroundColor='green' gap='10px' margin='10px 40px'>
        <Box backgroundColor='purple'>
          <Typography align='left' variant='h4' margin='10px' marginRight='20px'>Correct Notes</Typography>
          <StyledAdviceBox sx={{width:'40vw'}}>
            <PieChartCard
              val1={77}
              name1='On Time'
              val2={10}
              name2='Rushed'
              val3={13}
              name3='Dragged'
            />
            <Box flex={1}>
              <SubAdviceCard
                main='It looks like you were on time for only 77% of the piece.'
                details='You rushed 10% of your notes while you dragged on 13% of your notes.'
                tips='Remember getting it right is better than playing it fast!'
                height='100%'
              />
            </Box>
          </StyledAdviceBox>
        </Box>

        <Box>
          <Typography align='left' variant='h4' margin='10px' marginRight='20px'>Timing</Typography>
          <StyledAdviceBox sx={{width:'40vw'}}>
            <PieChartCard
              val1={77}
              name1='On Time'
              val2={10}
              name2='Rushed'
              val3={13}
              name3='Dragged'
            />
            <Box flex={1}>
              <SubAdviceCard
                main='It looks like you were on time for only 77% of the piece.'
                details='You rushed 10% of your notes while you dragged on 13% of your notes.'
                tips='Remember getting it right is better than playing it fast!'
                height='100%'
              />
            </Box>
          </StyledAdviceBox>
        </Box>

        <Box>
          <Typography align='left' variant='h4' margin='10px' marginRight='20px'>Note Types</Typography>
          <StyledAdviceBox sx={{width:'40vw'}}>
            <PieChartCard
              val1={77}
              name1='On Time'
              val2={10}
              name2='Rushed'
              val3={13}
              name3='Dragged'
            />
            <Box flex={1}>
              <SubAdviceCard
                main='It looks like you were on time for only 77% of the piece.'
                details='You rushed 10% of your notes while you dragged on 13% of your notes.'
                tips='Remember getting it right is better than playing it fast!'
                height='100%'
              />
            </Box>
          </StyledAdviceBox>
        </Box>

        <Box>
          <Typography align='left' variant='h4' margin='10px' marginRight='20px'>Articulation</Typography>
          <StyledAdviceBox sx={{width:'40vw'}}>
            <PieChartCard
              val1={77}
              name1='On Time'
              val2={10}
              name2='Rushed'
              val3={13}
              name3='Dragged'
            />
            <Box flex={1}>
              <SubAdviceCard
                main='It looks like you were on time for only 77% of the piece.'
                details='You rushed 10% of your notes while you dragged on 13% of your notes.'
                tips='Remember getting it right is better than playing it fast!'
                height='100%'
              />
            </Box>
          </StyledAdviceBox>
        </Box>

        <Box>
          <Typography align='left' variant='h4' margin='10px' marginRight='20px'>Dynamics</Typography>
          <StyledAdviceBox sx={{width:'40vw'}}>
            <PieChartCard
              val1={77}
              name1='On Time'
              val2={10}
              name2='Rushed'
              val3={13}
              name3='Dragged'
            />
            <Box flex={1}>
              <SubAdviceCard
                main='It looks like you were on time for only 77% of the piece.'
                details='You rushed 10% of your notes while you dragged on 13% of your notes.'
                tips='Remember getting it right is better than playing it fast!'
                height='100%'
              />
            </Box>
          </StyledAdviceBox>
        </Box>
      </Box>
      </ScrollContainer>
      <Box
        border='solid'
        margin='50px'
        height='1000px'
      >
        Insert Sheet Music Here
      </Box>

    </Box>
  );
};

export default TrackSummary;
