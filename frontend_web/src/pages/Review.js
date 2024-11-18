import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/nav_bar/NavBar';
import { Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {
  showErrorMessage,
  showSuccessMessage,
  showUploadingMessage,
} from '../helpers';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../context/TokenContext';

const Review = () => {
  const [review, setReview] = useState('');
  const { trackAttemptId } = useParams();
  const [recording, setRecording] = useState();
  const [rating, setRating] = useState(5);
  const { accessToken, userId, role } = useContext(TokenContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { student, title, artist } = location.state || {};

  // Fetch the recording from S3 bucket for the tutor to review
  useEffect(() => {
    // Check if valid token/role
    if (accessToken === null || role === 'student') {
      return navigate('/login');
    }

    const fetchRecording = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/files/user/audio/${trackAttemptId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRecording(response.data.url);
      } catch (err) {
        showErrorMessage(err.response.data.error);
      }
    };
    fetchRecording();
  }, [trackAttemptId, accessToken, role, navigate]);

  // call route that submits the review
  const handleClick = async () => {
    if (review === '') {
      showErrorMessage('Try again');
    } else {
      showUploadingMessage('Uploading review ...');
      try {
        const sendReview = {
          tutor: userId,
          trackAttemptId: trackAttemptId,
          feedback: review,
          rating: rating,
        };
        console.log(sendReview);
        await axios.post(
          'http://localhost:5001/review/submit',
          { ...sendReview },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        showSuccessMessage('Success! Your review was successfully uploaded.');
        return navigate('/dashboard');
      } catch (err) {
        showErrorMessage(err.response.data.error);
      }
    }
  };

  return (
    <>
      <NavBar></NavBar>
      <div className='m-10 flex flex-col items-center'>
        <h1 className='text-3xl font-medium'>Review Track Attempt</h1>

        <div className='p-8 text-xl mt-10 border shadow-xl rounded-lg md:w-[50%]'>
          <h1>
            <span className='font-semibold'>Song: </span>
            <span className=''>{title}</span> by {artist}
          </h1>
          <h1>
            <span className='font-semibold'>Student: </span> {student}
          </h1>

          <div className='my-10'>
            <h1 className='my-4 text-gray-600 font-medium'>
              Play Track Attempt{' '}
            </h1>
            <audio controls src={recording}></audio>
          </div>

          <div className='flex flex-col items-start gap-4'>
            <TextField
              data-cy='review-field'
              label='Enter your review'
              fullWidth
              onChange={(e) => setReview(e.target.value)}
            />
            <Button
              onClick={handleClick}
              variant='contained'
              endIcon={<SendIcon />}
            >
              Send Review
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Review;
