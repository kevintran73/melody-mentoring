import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CachedIcon from '@mui/icons-material/Cached';
import { Box, CircularProgress, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useNavigate, useParams } from 'react-router-dom';
import TokenContext from '../context/TokenContext';

import RefreshModelComponent from '../components/track_summary/RefreshModelComponent';
import NavBar from '../components/nav_bar/NavBar';
import RequestDialog from '../components/track_summary/RequestDialog';
import ReviewCard from '../components/track_summary/ReviewCard';
import StatisticsSection from '../components/track_summary/StatisticsSection';
import Thumbnail from '../components/track_summary/Thumbnail';

/**
 * Track Summary page
 */

const StyledButton = styled(IconButton)({
  backgroundColor: '#020E37',
  color: 'white',
  margin: '10px 0px 0px 20px',
  '&:hover': {
    backgroundColor: '#020E37',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
});

const StyledMainSummary = styled(Card)(() => ({
  padding: '20px',
  margin: '10px 30px 20px 30px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
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

  const sendSummaryFromChild = (data) => {
    console.log(data);
    setSummary(data);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Fetch summary info
    const fetchSummary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/attempts/user/feedback-for-attempt/${params.trackAttemptId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal,
          }
        );
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

    // Fetch track details
    const fetchTrackDetails = async (attemptId) => {
      try {
        const response = await axios.get(
          `http://localhost:5001/track-attempt/${attemptId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        fetchSongDetails(response.data);
        fetchReviewDetails(response.data.reviews);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching track details:', error);
      }
    };

    // After fetching track details get the song details
    const fetchSongDetails = async (track) => {
      try {
        const response = await axios.get(
          `http://localhost:5001/catalogue/songs/find/${track.songDetails.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const date = new Date(track.isoUploadTime);
        const dateTimeFormat = new Intl.DateTimeFormat('en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const updatedDate = dateTimeFormat.format(date);

        const newSongDetail = {
          ...response.data,
          date: updatedDate,
        };
        setSongDetails(newSongDetail);
      } catch (error) {
        console.error('Error fetching track details:', error);
      }
    };

    // Fetch the review data of the track attempt
    const fetchReviewDetails = async (reviewData) => {
      const allReviewDetails = [];

      for (const review of reviewData) {
        try {
          const response = await axios.get(
            `http://localhost:5001/profile/${review.tutor}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const newReviewDetail = {
            ...review,
            tutorName: response.data.username,
          };

          allReviewDetails.push(newReviewDetail);
        } catch (error) {
          console.error('Error fetching review details:', error);
        }
      }
      setReviews(allReviewDetails);
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

  return (
    <Box backgroundColor='#f9f9f9'>
      <NavBar />

      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <StyledButton onClick={navHistory}>
          <ArrowBackIcon />
        </StyledButton>

        <RefreshModelComponent
          sendSummaryFromChild={sendSummaryFromChild}
        ></RefreshModelComponent>
      </Box>

      <StyledMainSummary>
        <Box flex='4' marginRight='30px'>
          <Box
            boxShadow={4}
            height='100%'
            textAlign='center'
            display='flex'
            justifyContent='center'
            alignItems='center'
            borderRadius='16px'
          >
            <Typography fontSize='2rem' margin='20px 30px' overflowY='auto'>
              {summaryParagraphs ? (
                summaryParagraphs[0]
              ) : (
                <LoadingOverlayMain>
                  <CircularProgress size='20vh' />
                </LoadingOverlayMain>
              )}
            </Typography>
          </Box>
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

      {/* Section for statistics */}
      <StatisticsSection
        summary={summary}
        summaryParagraphs={summaryParagraphs}
      ></StatisticsSection>

      {/* Section for tutor reviews */}
      <Box margin='10px 40px'>
        <Box display='flex'>
          <Typography
            align='left'
            variant='h4'
            margin='30px'
            marginRight='20px'
          >
            Tutor Reviews
          </Typography>
          <RequestDialog></RequestDialog>
        </Box>
        {reviews ? (
          <ScrollContainer>
            <Box display='flex' flexDirection='row' gap='10px'>
              {reviews.map((review, i) => (
                <Box>
                  <StyledReviewBox sx={{ margin: '10px' }} key={i}>
                    <ReviewCard
                      tutor={review.tutorName}
                      feedback={review.feedback}
                      rating={review.rating}
                    />
                  </StyledReviewBox>
                </Box>
              ))}
              <Box>
                <StyledReviewBox sx={{ margin: '10px' }}>
                  <ReviewCard
                    tutor={'John'}
                    feedback={'Nice post!'}
                    rating={'4'}
                  />
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
