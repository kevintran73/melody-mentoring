import React from 'react'
import NavBar from '../components/nav_bar/NavBar'
import { Button, Select, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { showErrorMessage } from '../helpers';
import { useParams } from 'react-router-dom';


const options = [
  {value: 'daniel', label: 'Daniel'},
  {value: 'jennifer', label: 'Jennifer'},
  {value: 'jerome', label: 'Jerome'},
];

const Review = () => {
  const [review, setReview] = React.useState('')
  const { song } = useParams()
  const [students, setStudents] = React.useState([])

  // Fetch the recording from S3 bucket and/or feedback report of the track attempt for the tutor to review 

  const handleClick = () => {
    if (review === '') {
      showErrorMessage('Try again')
    } else {

      // Post the review for track attempt

      alert(review)
    }
  }
  return (
    <>
      <NavBar></NavBar>
      <div className='m-10 flex flex-col'>
        <h1 className='text-3xl font-medium'>Review recording</h1>
        <div className='my-8'>Recording & Post song summary</div>
        
        <Select
          options={options} 
          value={students}
        />
    
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