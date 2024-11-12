import React, { useEffect, useState } from 'react';
import NavBar from '../components/nav_bar/NavBar';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import HistoryCard from '../components/history/HistoryCard';
import GraphCard from '../components/history/GraphCard';
import { TextField, Typography } from '@mui/material';
import HistoryIntroCard from '../components/history/HistoryIntroCard';
import { styled } from '@mui/system';
import axios from 'axios';
import TokenContext from '../context/TokenContext';

/**
 * History page
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

const StyledSearchBar = styled(TextField)({
  marginBottom: '10px',
  width: '90%',
  width: '100%',
  marginBottom: '30px',
  backgroundColor: 'white',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
});

const LoadingOverlayMain = styled(Box)({
  // position: 'fixed',
  // top: 0,
  // left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 1000,
});


const History = () => {
  // const [trackAttempts, setTrackAttempts] = useState([]);
  const [songDetails, setSongDetails] = useState([]);
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
        // setTrackAttempts(trackDetails)
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

          const newSongDetail = {
            ...response.data,
            date: date,
            trackAttemptId: track['id'],
          };
          console.log(newSongDetail)
          allSongDetails.push(newSongDetail);
        } catch (error) {
          console.error('Error fetching song details:', error);
        }
      }
      allSongDetails.sort((a, b) => b.date - a.date);
      setSongDetails(allSongDetails)
    };

    fetchTrackAttempts();
  }, []);

  //Allows for filtering based on search input
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredPlaylist = songDetails.filter(song => 
    (song.title.toLowerCase().includes(searchInput.toLowerCase()) ||
    song.composer.toLowerCase().includes(searchInput.toLowerCase()))
  );

  return (
    <Box backgroundColor='#E3E3E3'>
      <NavBar></NavBar>
      <StyledTopContainer>
        <Box flex='2' height='100%'>
          <HistoryIntroCard title='Fantastic work!' />
        </Box>
      </StyledTopContainer>
      
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' marginX='10vw'>
        <StyledSearchBar id='outlined-basic' label='Search' variant='outlined' onChange={handleSearchChange} value={searchInput} />
        {filteredPlaylist.map((songDetail, i) => (
          <HistoryCard
            key={i}
            title={songDetail['title']}
            composer={songDetail['composer']}
            difficulty={songDetail['difficulty']}
            date={new Intl.DateTimeFormat('en', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(songDetail.date)}
            thumbnail={songDetail['thumbnail']}
            trackAttemptId={songDetail['trackAttemptId']}
          />
        ))}
        <HistoryCard
            title={'Ode to Joy (Test)'}
            composer={'Beethoven'}
            difficulty={1.2}
            // date={new Intl.DateTimeFormat('en', {
            //   year: 'numeric',
            //   month: 'long',
            //   day: 'numeric',
            // }).format(songDetail.date)}
            // thumbnail={songDetail['thumbnail']}
            trackAttemptId={'90d775a8-3cb1-4939-ab06-adadc4a98b18'}
          />
      </Box>
    </Box>
  );
};

export default History;
