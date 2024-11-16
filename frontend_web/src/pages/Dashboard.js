import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/nav_bar/NavBar';
import { useNavigate } from 'react-router-dom';
import pic from '../assets/default-img.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PrevArrow from '../components/tutor_interface/PrevArrow';
import NextArrow from '../components/tutor_interface/NextArrow';
import axios from 'axios';
import TokenContext from '../context/TokenContext';
import RateReviewIcon from '@mui/icons-material/RateReview';

const Dashboard = () => {
  const navigate = useNavigate();
  const { accessToken, userId, role } = useContext(TokenContext);
  const [experiments, setExperiments] = useState([]);

  const handleClick = (trackAttemptId) => {
    console.log(trackAttemptId);
    navigate(`/review/${trackAttemptId}`);
  };

  // Get list of track attempts that tutor needs to review "to_review"

  useEffect(() => {
    if (accessToken === null || !userId) {
      return navigate('/login');
    } else if (role === 'student') {
      return navigate('/catalogue');
    }

    const fetchTrackAttempts = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data.to_review;
        setExperiments(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTrackAttempts(); // Get a list of all the track attempts awaiting review
  }, [accessToken, userId, role, navigate]);

  return (
    <div>
      <NavBar></NavBar>
      <div className='m-10 flex flex-col'>
        <h1 className='text-3xl font-medium mb-10'>Experiments awaiting review</h1>

        {experiments.map((experiment) => (
          <div className='shadow-md border rounded-lg flex items-center p-3 m-2 justify-between h-20'>
            <div className='flex items-center'>
              <div className='font-semibold'>
                Track Attempt: <span className='text-gray-500'>{experiment}</span>{' '}
              </div>
            </div>
            <RateReviewIcon className='cursor-pointer' onClick={() => handleClick(experiment)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
