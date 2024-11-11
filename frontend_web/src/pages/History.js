import React, { useEffect, useState } from 'react';
import NavBar from '../components/nav_bar/NavBar';
import Box from '@mui/material/Box';
import HistoryCard from '../components/history/HistoryCard';
import GraphCard from '../components/history/GraphCard';
import { TextField, Typography } from '@mui/material';
import HistoryIntroCard from '../components/history/HistoryIntroCard';
import { styled } from '@mui/system';
import axios from 'axios';
import TokenContext from '../context/TokenContext';

/**
 * Uploads page
 */

const StyledTopContainer = styled(Box)(() => ({
  display:'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  margin: '2vw 10vw',
  height: '20vw',
  gap: '1vw',
}));

const History = () => {
  const [trackAttempts, setTrackAttempts] = useState([]);
  const [songDetails, setSongDetails] = useState([]);
  // const navigate = useNavigate();
  const { accessToken, userId } = React.useContext(TokenContext);

  useEffect(() => {
    const fetchTrackAttempts = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        fetchTrackDetails(response.data.track_attempts)
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchTrackDetails = async (attemptIds) => {
      try {
        const attemptPromises = attemptIds.map((attemptId) =>
          axios.get(`http://localhost:5001/track-attempt/${attemptId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ))
        const trackResponses = await Promise.allSettled(attemptPromises);
        const trackDetails = trackResponses.map((response) => response.value.data);
        setTrackAttempts(trackDetails)
        fetchSongDetails(trackDetails)
      } catch (error) {
        console.error('Error fetching track details:', error);
      }
    };

    const fetchSongDetails = async (trackData) => {
      const allSongDetails = [];

      for (const track of trackData) {
        try {
          const response = await axios.get(`http://localhost:5001/catalogue/songs/find/${track['songId']}`, {
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
          allSongDetails.push(newSongDetail);
        } catch (error) {
          console.error('Error fetching track details:', error);
        }
      }
      setSongDetails(allSongDetails)
    };

    fetchTrackAttempts();
  }, [accessToken]);

  return (
    <Box backgroundColor='#E3E3E3'>
      <NavBar></NavBar>
      <StyledTopContainer>
        <Box flex='2' height='100%'>
          <HistoryIntroCard title='Fantastic work!' />
        </Box>
      </StyledTopContainer>
      
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' marginX='10vw'>
        <TextField 
          sx={{
            width: '100%',
            marginBottom: '30px',
            backgroundColor: 'white',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          id='outlined-basic' label='Search' variant='outlined'
        />
        {/* <HistoryCard title='September' composer='Earth, Wind & Fire' difficulty='Medium' date='11:07PM Sunday 27 October 2024'/>
        <HistoryCard title='test' composer='test' difficulty='test' date='test'/> */}
            {songDetails.map((songDetail, i) => (
              <HistoryCard
                title={songDetail['title']}
                composer={songDetail['composer']}
                difficulty={songDetail['difficulty']}
                date={songDetail['date']}
                thumbnail={songDetail['thumbnail']}
              />
            ))}
      </Box>
    </Box>
  );
};

export default History;
