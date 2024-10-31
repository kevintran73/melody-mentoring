import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import { Box, Typography } from '@mui/material';
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

const TrackSummary = () => {
  const params = useParams();
  const trackAttemptId = params.trackAttemptId;
  const [summaryParagraphs, setSummaryParagraphs] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const token = useContext(TokenContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://localhost:5001/attempts/user/feedback-for-attempt/90d775a8-3cb1-4939-ab06-adadc4a98b18', {
          headers: {
            Authorization: `Bearer ${token['accessToken']}`,
          },
          signal,
        });
        setSummary(response.data);
        console.log(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Fetch cancelled:', error.message);
        } else {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchSummary();

    return () => {
      controller.abort();
    };
  }, [token]);

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
          {/* <Typography align='left' variant='h2' margin='10px' marginLeft='20px'>
            Track Attempt Summary
          </Typography> */}
          <Box boxShadow={4} height='100%' textAlign='center' display='flex' justifyContent='center' alignItems='center' borderRadius='16px'>
            <Typography fontSize='2rem' margin='20px 30px'>
              {summaryParagraphs ? summaryParagraphs[0] : 'Loading'}
            </Typography>
          </Box>
        </Box>
        <Box flex='1'>
          <Thumbnail
            title='September'
            artist='Earth, Wind & Fire'
            difficulty='Medium'
            date='11:07PM Sunday 27 October 2024'
          />
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
              <Typography>Loading</Typography>
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
                <Typography>Loading</Typography>
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
                <Typography>Loading</Typography>
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
                <Typography>Loading</Typography>
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
