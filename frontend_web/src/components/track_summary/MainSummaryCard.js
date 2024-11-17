import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { styled } from '@mui/system';
import React from 'react';
import RefreshModelComponent from './RefreshModelComponent';
import RequestDialog from './RequestDialog';
import Thumbnail from './Thumbnail';

/**
 * Main summary card component with thumbnail
 */

const StyledMainSummary = styled(Card)(() => ({
  padding: '20px',
  height: '400px',
  margin: '10px 30px 20px 30px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: 5,
  '@media (max-width: 1000px)': {
    flexDirection: 'column',
    height: '700px',
  },
}));

const StyledMainSummaryCard = styled(Box)(() => ({
  height: '100%',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '16px',
  overflowY: 'auto',
  padding: '20px',
}));

const LoadingOverlayMain = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 1000,
});

const StyledAudio = styled('audio')({
  width: '100%',
});

const MainSummaryCard = ({
  summaryParagraphs,
  songDetails,
  recording,
  sendSummaryFromChild,
}) => {
  return (
    <StyledMainSummary>
      {/* Main summary for track attempt */}
      <Box flex='4' height='100%'>
        <StyledMainSummaryCard boxShadow={4}>
          {summaryParagraphs ? (
            <Typography
              sx={{
                fontSize: '1.5vw',
                overflowY: 'auto',

                '@media (max-width: 1000px)': {
                  fontSize: '1.2rem',
                },
              }}
            >
              {summaryParagraphs[0]}
            </Typography>
          ) : (
            <LoadingOverlayMain overflow='hidden'>
              <CircularProgress size='20vh' />
            </LoadingOverlayMain>
          )}
        </StyledMainSummaryCard>
      </Box>

      <Box
        flex='3'
        sx={{
          display: 'flex',
          width: '100%',
          padding: '20px',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Song details card */}
        <Box flex='1'>
          {songDetails ? (
            <Thumbnail
              title={songDetails['title']}
              thumbnail={songDetails['thumbnail']}
              composer={songDetails['composer']}
              difficulty={songDetails['difficulty']}
              date={songDetails['date']}
            />
          ) : (
            <LoadingOverlayMain>
              <CircularProgress size='20vh' />
            </LoadingOverlayMain>
          )}
        </Box>

        {/* Section for audio, changing AI models and 
          requesting reviews from tutors */}
        <Box
          flex='1'
          width='100%'
          height='100%'
          display='flex'
          flexDirection='column'
          justifyContent='space-evenly'
          alignItems='center'
          margin='20px'
          textAlign='center'
          sx={{
            width: '100%',
            '@media (max-width: 1000px)': {
              width: '25vw',
            },
          }}
        >
          <StyledAudio controls src={recording} />
          <Divider sx={{ width: '100%', my: 2 }} />
          <RefreshModelComponent sendSummaryFromChild={sendSummaryFromChild} />
          <Divider sx={{ width: '100%', my: 2 }} />
          <RequestDialog />
        </Box>
      </Box>
    </StyledMainSummary>
  );
};

export default MainSummaryCard;
