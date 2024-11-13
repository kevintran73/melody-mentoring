import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from '@mui/material/IconButton';
import ScrollContainer from 'react-indiana-drag-scroll';
import TokenContext from '../context/TokenContext';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import NavBar from '../components/nav_bar/NavBar';
import PieChartCard from '../components/track_summary/PieChartCard';
import SubAdviceCard from '../components/track_summary/SubAdviceCard';
import Thumbnail from '../components/track_summary/Thumbnail';
import BarChartCard from '../components/track_summary/BarChartCard';
import ReviewCard from '../components/track_summary/ReviewCard';

/**
 * Track Summary page
 */

const StyledButton = styled(IconButton)({
  backgroundColor: '#020E37',
  color: 'white',
  // width: '50px',
  margin: '10px 0px 0px 20px',
  '&:hover': {
    backgroundColor: '#020E37',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
});

const StyledTextButton = styled(Button)({
  width: '17vw',
  backgroundColor: '#020E37',
  color:'white',
  fontSize: '1.3rem',
  padding: '8px 8px',
  textTransform: 'none',
  borderRadius: '16px',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: '#020E37',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
});

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
  margin: '10px 30px 20px 30px',
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

const StyledReviewBox = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '20px',
  margin: '10px',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'white',
  gap: '30px',
  height: '450px',
  width: '400px',
  borderRadius: '16px',
  boxShadow: 5,
  position: 'relative',
}));

const TrackSummary = () => {
  const params = useParams();
  const [summaryParagraphs, setSummaryParagraphs] = useState(null);
  const [summary, setSummary] = useState(null);
  const [songDetails, setSongDetails] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [model, setModel] = useState('gemma-7b-it');
  const { accessToken } = React.useContext(TokenContext);

  const navigate = useNavigate();

  const navHistory = () => {
    return navigate('/history');
  };

  const handleChange = (event) => {
    setModel(event.target.value);
  };

  const handleRefresh = () => {
    refreshSummary(model)
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSummary = async () => {
      try {
        // const response = await axios.get('http://localhost:5001/attempts/user/feedback-for-attempt/90d775a8-3cb1-4939-ab06-adadc4a98b18', {
        const response = await axios.get(`http://localhost:5001/attempts/user/feedback-for-attempt/${params.trackAttemptId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal,
        });
        setSummary(response.data);
        fetchTrackDetails(params.trackAttemptId);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Fetch cancelled:', error.message);
        } else {
          console.error('Error fetching feedback details:', error);
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
        fetchReviewDetails(response.data.reviews)
        setReviews(response.data.reviews)
        // console.log(response.data.reviews)
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
        // console.log(newSongDetail)
        setSongDetails(newSongDetail)
      } catch (error) {
        console.error('Error fetching track details:', error);
      }
    }

    const fetchReviewDetails = async (reviewData) => {
      const allReviewDetails = [];

      for (const review of reviewData) {
        try {
          const response = await axios.get(`http://localhost:5001/profile/${review.tutor}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const newReviewDetail = {
            ...review,
            tutorName: response.data.username,
          };

          allReviewDetails.push(newReviewDetail);
        } catch (error) {
          console.error('Error fetching review details:', error);
        }
      }
      setReviews(allReviewDetails)
    };

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

  const refreshSummary = async (model) => {
    try {
      // const response = await axios.get('http://localhost:5001/attempts/user/feedback-for-attempt/90d775a8-3cb1-4939-ab06-adadc4a98b18', {
      const response = await axios.get(`http://localhost:5001/attempts/user/feedback-for-attempt/${params.trackAttemptId}?model=${model}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSummary(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Fetch cancelled:', error.message);
      } else {
        console.error('Error fetching user details:', error);
      }
    }
  };

  return (
    <Box backgroundColor='#f9f9f9'>
      <NavBar />

      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <StyledButton onClick={navHistory}>
          <ArrowBackIcon />
        </StyledButton>

        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' sx={{ width: '250px', margin: '15px 15px 0px 0px', gap: '10px' }}>
          <Box display='flex' flexDirection='row'>
            <FormControl>
              <InputLabel id='model-select-label'>Model</InputLabel>
              <Select
                defaultValue={'gemma-7b-it'}
                labelId='model-select-label'
                id='model-select'
                value={model}
                label='Model'
                onChange={handleChange}
              >
                <MenuItem value={'gemma2-9b-it'}>Gemma2-9b</MenuItem>
                <MenuItem value={'gemma-7b-it'}>Gemma-7b</MenuItem>
                <MenuItem value={'llama3-groq-70b-8192-tool-use-preview'}>Llama-groq-70b</MenuItem>
                <MenuItem value={'llama-3.1-70b-versatile'}>Llama-3.1-70b</MenuItem>
                <MenuItem value={'llama-3.1-8b-instant'}>Llama-3.18b</MenuItem>
                <MenuItem value={'llama-3.2-1b-preview'}>Llama-3.2-1b</MenuItem>
                <MenuItem value={'llama-3.2-3b-preview'}>Llama-3.2-3b</MenuItem>
                <MenuItem value={'llama-3.2-11b-vision-preview'}>Llama-3.2-11b</MenuItem>
                <MenuItem value={'llama-3.2-90b-vision-preview'}>Llama-3.2-90b</MenuItem>
                <MenuItem value={'llama3-70b-8192'}>Llama3-70b</MenuItem>
                <MenuItem value={'llama3-8b-8192'}>Llama3-8b</MenuItem>
                <MenuItem value={'mixtral-8x7b-32768'}>Mixtral</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <StyledButton onClick={handleRefresh}>
                <CachedIcon />
              </StyledButton>
            </Box>
          </Box>
          <Typography variant='subtitle' fontSize='0.8rem' color='grey'>Changing models may take a moment</Typography>
        </Box>
      </Box>

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

      <Box margin='10px 40px'>
        <Box display='flex'>
          <Typography align='left' variant='h4' margin='10px' marginRight='20px'>
            Tutor Reviews
          </Typography>
          <StyledTextButton>Request Review</StyledTextButton>
        </Box>
        {reviews ? (
          <ScrollContainer>
            <Box
              display='flex'
              flexDirection='row'
              // justifyContent='space-evenly'
              gap='10px'
              // margin='10px 40px'
            >
              {reviews.map((review, i) => (
                <Box>
                  <StyledReviewBox sx={{ margin: '10px' }} key={i}>
                    <ReviewCard tutor={review.tutorName} feedback={review.feedback} rating={review.rating} />
                  </StyledReviewBox>
                </Box>
              ))}
              <Box>
                <StyledReviewBox sx={{ margin: '10px' }}>
                    <ReviewCard tutor={'test'} feedback={'test'} rating={'test'}/>
                </StyledReviewBox>
              </Box>

              <Box>
                <StyledReviewBox sx={{ margin: '10px' }}>
                    <ReviewCard tutor={'test'} feedback={'test'} rating={'test'}/>
                </StyledReviewBox>
              </Box>

              <Box>
                <StyledReviewBox sx={{ margin: '10px' }}>
                    <ReviewCard tutor={'test'} feedback={'test'} rating={'test'}/>
                </StyledReviewBox>
              </Box>
            </Box>
          </ScrollContainer>
        ) : (
          <StyledReviewBox sx={{ width: '50vw' }}>
            <LoadingOverlay>
              <CircularProgress size='20vh' />
            </LoadingOverlay>
          </StyledReviewBox>
        )}

      </Box>
    </Box>
  );
};

export default TrackSummary;
