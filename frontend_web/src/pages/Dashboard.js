import React, { useContext, useEffect, useState } from 'react'
import NavBar from '../components/nav_bar/NavBar'
import { useNavigate } from 'react-router-dom';
import pic from '../assets/default-img.png'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PrevArrow from '../components/tutor_interface/PrevArrow';
import NextArrow from '../components/tutor_interface/NextArrow';
import axios from 'axios';
import TokenContext from '../context/TokenContext';
import RateReviewIcon from '@mui/icons-material/RateReview';
 

const experiments = [
  {
    id: 1,
    user: 'Daniel',
    song: 'song 1',
    img: pic,
  },
  {
    id: 2,
    user: 'Kevin',
    song: 'song 2',
    img: pic,
  },
]


const Dashboard = () => {

  const navigate = useNavigate();
  const {accessToken, userId} = useContext(TokenContext);
  //const [experiments, setExperiments] = useState([])

  const handleClick = (trackAttemptId) => {
    navigate(`/review/${trackAttemptId}`)
  }

  // Get list of track attempts that tutor needs to review "to_review"
  // the role does not change, however, the to_review, students, requests will change so must have useeffect

  /*
  useEffect(() => {
    const fetchTrackAttempts = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data.to_review;
        console.log(data)
        setExperiments(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTrackAttempts(); // Get a list of all the track attempts awaiting review
  }, []); */



  return (
    <div>
      <NavBar></NavBar>
      <div className='m-10 flex flex-col'>
      <h1 className='text-3xl font-medium mb-10'>Experiments awaiting review</h1>

      {experiments.map((experiment) => (
        <div className='shadow-md border rounded-lg flex items-center p-3 m-2 justify-between'>
          <div className='flex items-center'>
            <img src={experiment.img} className='h-[75px] rounded-xl'/>
            <div>{experiment.user}</div>
            <div>{experiment.song}</div>
          </div>

          <RateReviewIcon className='cursor-pointer' onClick={() => handleClick(experiment.id)} />
          
        </div>
      ))}
        


      </div>
    </div>
  )
}

export default Dashboard