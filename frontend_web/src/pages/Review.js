import React, { useContext, useEffect, useState } from 'react'
import NavBar from '../components/nav_bar/NavBar'
import { Button, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { showErrorMessage } from '../helpers';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../context/TokenContext';

const Review = () => {
  const [review, setReview] = useState('')
  const { trackAttemptId } = useParams()
  const [recording, setRecording] = useState()
  const [rating, setRating] = useState(5)
  const {accessToken, userId} = useContext(TokenContext);
 
  // Fetch the recording from S3 bucket for the tutor to review 
  /* 
  useEffect(() => {
    const fetchRecording = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/files/user/audio/${trackAttemptId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRecording(response.data.url);
      } catch (error) {
        console.error('Error fetching recording:', error);
      }
    };
    fetchRecording()
  }, []);
  */

  // call route that submits the review
  const handleClick = async () => {
    if (review === '') {
      showErrorMessage('Try again')
    } else {
      try {
        alert(review)

        await axios.post('http://localhost:5001/review/submit', 
          {
            tutor: userId,
            trackAttemptId: trackAttemptId,
            feedback: review,
            rating: rating,
          }, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        
      } catch (error) {
        console.error(error)
      } 
    }
  }

  return (
    <>
      <NavBar></NavBar>
      <div className='m-10 flex flex-col'>
        <h1 className='text-3xl font-medium'>Review Track Attempt</h1>
        <div className='my-8'>Recording & Post song summary</div>
    
        <div className='flex flex-col items-start gap-4 my-8'>
          <TextField 
            label='Enter your review'
            fullWidth
            onChange={(e) => setReview(e.target.value)}
          />
          <Button onClick={handleClick} variant="contained" endIcon={<SendIcon />}>Send Review</Button>
        </div>
      </div>
    </>
  )
}
export default Review