import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, CircularProgress, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/nav_bar/NavBar';
import MainSummaryCard from '../components/track_summary/MainSummaryCard';
import ReviewCard from '../components/track_summary/ReviewCard';
import StatisticsSection from '../components/track_summary/StatisticsSection';
import TokenContext from '../context/TokenContext';
import { showErrorMessage } from '../helpers';

/**
 * Track Summary page
 */

const StyledButton = styled(IconButton)({
  backgroundColor: '#020E37',
  width: '60px',
  height: '60px',
  color: 'white',
  '&:hover': {
    backgroundColor: 'blue',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
});

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
  const [reviews, setReviews] = useState([]);
  const [recording, setRecording] = useState('');
  const { accessToken, userId } = React.useContext(TokenContext);

  const navigate = useNavigate();

  const navHistory = () => {
    return navigate('/history');
  };

  const sendSummaryFromChild = (data) => {
    setSummary(data);
  };

  useEffect(() => {
    // Navigate to login if invalid token or user id
    if (accessToken === null || !userId) {
      return navigate('/login');
    }

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
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Fetch cancelled:', err.message);
        } else {
          // If file doesn't exist
          showErrorMessage(err.response.data.error);

          return navigate('/history');
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
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/review/${params.trackAttemptId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response.data.reviews);
        fetchTutorName(response.data.reviews);
      } catch (error) {
        console.error('Error fetching review details:', error);
      }
    };

    // Fetch the tutor names of reviews
    const fetchTutorName = async (reviews) => {
      try {
        const reviewsList = [];

        for (let review of reviews) {
          const response = await axios.get(
            `http://localhost:5001/profile/${review.tutor}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const reviewInfo = {
            feedback: review.feedback,
            tutorName: response.data.username,
          };
          reviewsList.push(reviewInfo);
        }

        console.log(reviewsList);
        setReviews(reviewsList);
      } catch (error) {
        console.error('Error fetching review details:', error);
      }
    };

    // Fetch recording audio of the track attempt
    const fetchRecording = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/files/user/audio/${params.trackAttemptId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRecording(response.data.url);
      } catch (error) {
        console.error('Error fetching recording:', error);
      }
    };

    fetchReviews();
    fetchRecording();
    fetchSummary();
    return () => {
      controller.abort();
    };
  }, [accessToken, params.trackAttemptId, navigate]);

  // Split summary into paragraphs for displaying
  useEffect(() => {
    if (summary) {
      const summaryParagraphs = summary['groqSays'].split('\n\n');
      setSummaryParagraphs(summaryParagraphs);
    }
  }, [summary]);

  return (
    <Box backgroundColor='#f9f9f9'>
      <NavBar />

      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        margin='10px 30px'
        position='relative'
      >
        <StyledButton onClick={navHistory}>
          <ArrowBackIcon />
        </StyledButton>
      </Box>

      {/* Section for main summary, song detail card and additional actions */}
      <MainSummaryCard
        summaryParagraphs={summaryParagraphs}
        songDetails={songDetails}
        recording={recording}
        sendSummaryFromChild={sendSummaryFromChild}
      />

      {/* Section for statistics */}
      <StatisticsSection
        summary={summary}
        summaryParagraphs={summaryParagraphs}
      />

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
        </Box>
        {reviews ? (
          <ScrollContainer>
            <Box display='flex' flexDirection='row' gap='10px'>
              {reviews.map((review, i) => (
                <Box key={i}>
                  <StyledReviewBox sx={{ margin: '10px' }}>
                    <ReviewCard
                      tutor={review.tutorName}
                      feedback={review.feedback}
                      rating={review.rating}
                    />
                  </StyledReviewBox>
                </Box>
              ))}
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
