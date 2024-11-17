import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/nav_bar/NavBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../context/TokenContext';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { showErrorMessage } from '../helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { accessToken, userId, role } = useContext(TokenContext);
  const [experiments, setExperiments] = useState([]);
  const [username, setUsername] = useState('')

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
        
        setUsername(response.data.username)

        const data = response.data.to_review; // list of track attempt ids, get student names

        let res = data.map((id) =>
          axios.get(`http://localhost:5001/track-attempt/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        );
        let responses = await Promise.all(res);
  
        let trackDetails = responses.map((response) => {
          const { id, userId, songDetails } = response.data;
          return { id, userId, songDetails };
        });

        let updatedExperiments = []
        for (let track of trackDetails) {
          const response = await axios.get(`http://localhost:5001/profile/${track.userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          track = { ...track, username: response.data.username }
          updatedExperiments.push(track)
        }
    
        setExperiments(updatedExperiments);
      } catch (err) {
        showErrorMessage(err.response.data.error)
      }
    };

    fetchTrackAttempts(); // Get a list of all the track attempts awaiting review
  }, [accessToken, userId, role, navigate]);


  const handleClick = (experiment) => {
    navigate(`/review/${experiment.id}`, { state: { student: experiment.username, title: experiment.songDetails.title, artist: experiment.songDetails.composer } });
  };

  return (
    <div>
      <NavBar></NavBar>
      <div className='m-10 flex flex-col'>
        <h1 className='text-4xl font-medium mb-10'>Welcome Back, {username}</h1>
        <div className='font-medium text-slate-500 text-lg m-2'>When your students request a review, their track attempts will be available for you to review</div>
        
        {experiments.map((experiment) => (
          <div className='shadow-md border rounded-lg flex items-center p-3 m-2 justify-between h-20'>
            <div className='flex items-center'>
              <div>
                <span className='font-semibold'>{experiment.songDetails.title}</span> <span className='italic'>({experiment.songDetails.composer})</span> - Submitted by {experiment.username}
              </div>
            </div>
            <div className='cursor-pointer font-medium hover:underline' onClick={() => handleClick(experiment)}>Review <RateReviewIcon /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
