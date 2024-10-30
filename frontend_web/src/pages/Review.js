import React from 'react'
import NavBar from '../components/nav_bar/NavBar'
import { Button, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { showErrorMessage } from '../helpers';
import { useParams } from 'react-router-dom';
const Review = () => {
  const [review, setReview] = React.useState('')
  const { studentId } = useParams()
  const handleClick = () => {
    if (review === '') {
      showErrorMessage('Try again')
    } else {
      alert(review)
    }
  }
  return (
    <>
      <NavBar></NavBar>
      <div className='m-10 flex flex-col'>
        <h1 className='text-3xl font-medium'>Review recording</h1>
        <div className='my-8'>Recording & Post song summary</div>
        <div>{studentId}</div>
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