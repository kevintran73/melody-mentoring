import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { styled, useMediaQuery } from '@mui/system';
import React from 'react';
import RefreshModelComponent from './RefreshModelComponent';
import RequestDialog from './RequestDialog';
import Thumbnail from './Thumbnail';

/**
 * Main summary card component with thumbnail
 */

const StyledMainSummary = styled(Card)(() => ({
  padding: '20px',
  height: 'auto',
  margin: '10px 30px 20px 30px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: 5,
  '@media (max-width: 1000px)': {
    flexDirection: 'column',
    height: '100%',
  },
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    height: '100%',
  },
}));

const StyledMainSummaryCard = styled(Box)(() => ({
  height: '100%',
  minHeight: '300px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '16px',
  overflowY: 'auto',
  padding: '20px',
  width: '80%',
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

const StyledVideo = styled('video')({
  width: '50%',

  '@media (max-width: 1000px)': {
    width: '90%',
  },
});

const MainSummaryCard = ({
  summaryParagraphs,
  songDetails,
  recording,
  isAudio,
  sendSummaryFromChild,
}) => {
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');

  return (
    <StyledMainSummary>
      {/* Main summary for track attempt */}
      <Box
        flex='4'
        height='100%'
        sx={{
          display: 'flex',
          width: '100%',
          padding: '20px',
          flexDirection: 'row',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
          '@media (max-width: 1000px)': {
            flexDirection: 'column',
            padding: '0px',
          },
        }}
      >
        <StyledMainSummaryCard boxShadow={4}>
          {summaryParagraphs ? (
            <Typography
              sx={{
                fontSize: '1.4rem',
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
        {isAudio && (
          <Box
            flex='1'
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <StyledAudio controls src={recording} />
            <Divider sx={{ width: '100%', my: 2 }} />
            <RefreshModelComponent
              sendSummaryFromChild={sendSummaryFromChild}
            />
            <Divider sx={{ width: '100%', my: 2 }} />
            <RequestDialog />
          </Box>
        )}
      </Box>
      {!isAudio && (
        <Box
          flex='3'
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            '@media (max-width: 1000px)': {
              flexDirection: 'column',
            },
          }}
        >
          {/* Section for audio, changing AI models and 
          requesting reviews from tutors */}
          <Box
            flex='1'
            width='100vw'
            height='100%'
            display='flex'
            flexDirection='row'
            gap='20px'
            justifyContent='space-evenly'
            alignItems='center'
            textAlign='center'
            margin='20px'
            sx={{
              width: '100%',
              '@media (max-width: 1000px)': {
                flexDirection: 'column',
                gap: '0px',
              },
            }}
          >
            <>
              <StyledVideo controls src={recording} />
              <div>
                {isSmallScreen && <Divider sx={{ width: '100%', my: 2 }} />}
                <RefreshModelComponent
                  sendSummaryFromChild={sendSummaryFromChild}
                />
                <Divider sx={{ width: '100%', my: 2 }} />
                <RequestDialog />
              </div>
            </>
          </Box>
        </Box>
      )}
    </StyledMainSummary>
  );
};

export default MainSummaryCard;
