import { Box, CircularProgress, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/system';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';

import BarChartCard from './BarChartCard';
import PieChartCard from './PieChartCard';
import SubAdviceCard from './SubAdviceCard';

/**
 * Track Summary page
 */

const StyledAdviceBox = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '20px',
  margin: '10px',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'white',
  gap: '30px',
  height: '450px',
  borderRadius: '16px',
  boxShadow: 5,
  position: 'relative',
}));

const LoadingOverlay = styled('div')({
  backgroundColor: 'rgba(255, 255, 255, 0)',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
});

const PieSection = ({ title, summary, id, index, summaryParagraphs }) => {
  return (
    <Box>
      <Typography align='left' variant='h4' margin='10px' marginRight='20px'>
        {title}
      </Typography>
      <StyledAdviceBox sx={{ width: '900px' }}>
        {summary ? (
          <>
            <Box flex={7}>
              <PieChartCard val1={summary[id] * 100} name1='On Time' flex={1} />
            </Box>
            <Box flex={12}>
              <SubAdviceCard
                details={
                  summaryParagraphs ? summaryParagraphs[index] : 'Loading'
                }
              />
            </Box>
          </>
        ) : (
          <LoadingOverlay>
            <CircularProgress size='20vh' />
          </LoadingOverlay>
        )}
      </StyledAdviceBox>
    </Box>
  );
};

const StatisticsSection = ({ summary, summaryParagraphs }) => {
  return (
    <ScrollContainer>
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-evenly'
        gap='10px'
        margin='10px 40px'
      >
        {/* Rhythm section */}
        <Box>
          <Typography
            align='left'
            variant='h4'
            margin='10px'
            marginRight='20px'
          >
            Rhythm
          </Typography>
          <StyledAdviceBox sx={{ width: '900px' }}>
            {summary ? (
              <>
                <Box flex={2}>
                  <BarChartCard val1={summary['rhythm']} />
                </Box>
                <Box flex={54}>
                  <SubAdviceCard
                    details={
                      summaryParagraphs ? summaryParagraphs[1] : 'Loading'
                    }
                  />
                </Box>
              </>
            ) : (
              <Box alignItems='center' justifyContent='center'>
                <LoadingOverlay>
                  <CircularProgress size='20vh' />
                </LoadingOverlay>
              </Box>
            )}
          </StyledAdviceBox>
        </Box>

        <PieSection
          title='Pitch'
          summary={summary}
          id={'pitch'}
          index={2}
          summaryParagraphs={summaryParagraphs}
        />

        <PieSection
          title='Intonation'
          summary={summary}
          id={'intonation'}
          index={3}
          summaryParagraphs={summaryParagraphs}
        />

        <PieSection
          title='Dynamics'
          summary={summary}
          id={'dynamics'}
          index={4}
          summaryParagraphs={summaryParagraphs}
        />
      </Box>
    </ScrollContainer>
  );
};

export default StatisticsSection;
