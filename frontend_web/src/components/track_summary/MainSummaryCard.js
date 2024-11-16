import { Box, CircularProgress, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { styled } from '@mui/system';
import React from 'react';

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

const MainSummaryCard = ({ summaryParagraphs, songDetails }) => {
  return (
    <StyledMainSummary>
      <Box flex='4' marginRight='30px' height='100%'>
        <StyledMainSummaryCard boxShadow={4}>
          <Typography
            sx={{
              fontSize: '1.8vw',
              overflowY: 'auto',

              '@media (max-width: 1000px)': {
                fontSize: '1rem',
              },
            }}
          >
            {summaryParagraphs ? (
              summaryParagraphs[0]
            ) : (
              <LoadingOverlayMain overflow='hidden'>
                <CircularProgress size='20vh' />
              </LoadingOverlayMain>
            )}
          </Typography>
        </StyledMainSummaryCard>
      </Box>
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
    </StyledMainSummary>
  );
};

export default MainSummaryCard;
