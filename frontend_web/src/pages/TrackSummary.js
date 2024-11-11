import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import { Box, Typography, CircularProgress } from '@mui/material';
import NavBar from '../components/nav_bar/NavBar';
import PieChartCard from '../components/track_summary/PieChartCard';
import SubAdviceCard from '../components/track_summary/SubAdviceCard';
import Thumbnail from '../components/track_summary/Thumbnail';
import ScrollContainer from 'react-indiana-drag-scroll';
import TokenContext from '../context/TokenContext';
import { styled } from '@mui/system';
import BarChartCard from '../components/track_summary/BarChartCard';

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

const StyledMainSummary = styled(Card)(() => ({
  padding: '20px',
  margin: '30px',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: 5,
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

const LoadingOverlayMain = styled(Box)({
  // position: 'fixed',
  // top: 0,
  // left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 1000,
});

const TrackSummary = () => {
  const params = useParams();
  const [summaryParagraphs, setSummaryParagraphs] = useState(null);
  const [summary, setSummary] = useState(null);
  const [songDetails, setSongDetails] = useState(null);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { accessToken, userId } = React.useContext(TokenContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://localhost:5001/attempts/user/feedback-for-attempt/90d775a8-3cb1-4939-ab06-adadc4a98b18', {
        // const response = await axios.get(`http://localhost:5001/attempts/user/feedback-for-attempt/${params.trackAttemptId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal,
        });
        setSummary(response.data);
        // fetchTrackDetails(params.trackAttemptId);
        fetchTrackDetails('90d775a8-3cb1-4939-ab06-adadc4a98b18');
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Fetch cancelled:', error.message);
        } else {
          console.error('Error fetching user details:', error);
        }
      }
    };

    const fetchTrackDetails = async (attemptId) => {
      try {
        const response = await axios.get(`http://localhost:5001/track-attempt/${attemptId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        fetchSongDetails(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching track details:', error);
      }
    };

    const fetchSongDetails = async (track) => {
        try {
          const response = await axios.get(`http://localhost:5001/catalogue/songs/find/${track.songId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const date = new Date(track.isoUploadTime);
          const dateTimeFormat = new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          const updatedDate = dateTimeFormat.format(date)

          const newSongDetail = {
            ...response.data,
            date: updatedDate,
          };
          console.log(newSongDetail)
          setSongDetails(newSongDetail)
        } catch (error) {
          console.error('Error fetching track details:', error);
        }
      }

    fetchSummary();
    return () => {
      controller.abort();
    };
  }, [accessToken]);

  useEffect(() => {
    if (summary) {
      const summaryParagraphs = summary['groqSays'].split('\n\n');
      setSummaryParagraphs(summaryParagraphs);
    }
  }, [summary]);

  return (
    <Box backgroundColor='#f9f9f9'>
      <NavBar />
      <StyledMainSummary>
        <Box flex='4' marginRight='30px'>
          <Box boxShadow={4} height='100%' textAlign='center' display='flex' justifyContent='center' alignItems='center' borderRadius='16px'>
            <Typography fontSize='2rem' margin='20px 30px'>
              {summaryParagraphs ? summaryParagraphs[0] : 
                <LoadingOverlayMain>
                  <CircularProgress size='20vh' />
                </LoadingOverlayMain>
              }
            </Typography>
          </Box>
        </Box>
        <Box flex='1'>
          {songDetails ? 
            <Thumbnail
              title={songDetails['title']}
              thumbnail={songDetails['thumbnail']}
              composer={songDetails['composer']}
              difficulty={songDetails['difficulty']}
              date={songDetails['date']}
            />
            : 
            <LoadingOverlayMain>
              <CircularProgress size='20vh' />
            </LoadingOverlayMain>
          }

        </Box>
      </StyledMainSummary>

      <ScrollContainer>
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='space-evenly'
          gap='10px'
          margin='10px 40px'
        >
          <Box>
            <Typography align='left' variant='h4' margin='10px' marginRight='20px'>
              Rhythm
            </Typography>
            <StyledAdviceBox sx={{ width: '50vw' }}>
            {summary ? (
              <>
                <BarChartCard val1={summary['rhythm']} />
                <Box flex={1}>
                  <SubAdviceCard details={summaryParagraphs ? summaryParagraphs[1] : 'Loading'} />
                </Box>
              </>) : (
                <Box alignItems='center' justifyContent='center' >
                  <LoadingOverlay>
                    <CircularProgress size='20vh' />
                  </LoadingOverlay>
                </Box>
            )}
            </StyledAdviceBox>
          </Box>

          <Box>
            <Typography align='left' variant='h4' margin='10px' marginRight='20px'>
              Pitch
            </Typography>
            <StyledAdviceBox sx={{ width: '50vw' }}>
              {summary ? (
              <>
                <PieChartCard
                  val1={74}
                  name1='On Time'
                />
                <Box flex={1}>
                  <SubAdviceCard details={summaryParagraphs ? summaryParagraphs[2] : 'Loading'} />
                </Box>  
              </>) : (
                <LoadingOverlay>
                  <CircularProgress size='20vh' />
                </LoadingOverlay>
              )}
            </StyledAdviceBox>
          </Box>

          <Box>
            <Typography align='left' variant='h4' margin='10px' marginRight='20px'>
              Intonation
            </Typography>
            <StyledAdviceBox sx={{ width: '50vw' }}>
              {summary ? (
                <>
                  <PieChartCard
                    val1={summary['intonation'] * 100}
                    name1='On Time'
                  />
                  <Box flex={1}>
                    <SubAdviceCard details={summaryParagraphs ? summaryParagraphs[3] : 'Loading'} />
                  </Box>
                </>
              ) : (
                <LoadingOverlay>
                  <CircularProgress size='20vh' />
                </LoadingOverlay>
              )}
            </StyledAdviceBox>
          </Box>

          <Box>
            <Typography align='left' variant='h4' margin='10px' marginRight='20px'>
              Dynamics
            </Typography>
            <StyledAdviceBox sx={{ width: '50vw' }}>
              {summary ? (
                <>
                  <PieChartCard
                    val1={summary['dynamics'] * 100}
                    name1='On Time'
                  />
                  <Box flex={1}>
                    <SubAdviceCard details={summaryParagraphs ? summaryParagraphs[4] : 'Loading'} />
                  </Box>
                </>
              ) : (
                <LoadingOverlay>
                  <CircularProgress size='20vh' />
                </LoadingOverlay>
              )}
            </StyledAdviceBox>
          </Box>

        </Box>
      </ScrollContainer>
/
    </Box>
  );
};

export default TrackSummary;
