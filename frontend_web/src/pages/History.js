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
import { useNavigate } from 'react-router-dom';

/**
 * History page
 */

const StyledTopContainer = styled(Box)(() => ({
  display: 'flex',
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
  const navigate = useNavigate();

  const [songDetails, setSongDetails] = useState([]);
  const { accessToken, userId, role } = React.useContext(TokenContext);

  useEffect(() => {
    // Navigate to login if invalid token or role
    if (accessToken === null || role === 'tutor') {
      return navigate('/login');
    }

    const fetchTrackAttempts = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/track-attempt/history/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSongDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchTrackAttempts();
  }, [accessToken, userId, role, navigate]);

  // Allows for filtering based on search input
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredTracks = songDetails.filter(
    (song) =>
      song.songTitle.toLowerCase().includes(searchInput.toLowerCase()) ||
      song.songComposer.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <Box>
      <NavBar></NavBar>
      <StyledTopContainer>
        <Box flex='2' height='100%'>
          <HistoryIntroCard title='Welcome to the history page!' />
        </Box>
      </StyledTopContainer>

      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        marginX='10vw'
      >
        <StyledSearchBar
          id='outlined-basic'
          label='Search'
          variant='outlined'
          onChange={handleSearchChange}
          value={searchInput}
        />

        {filteredTracks.length > 0 ? (
          filteredTracks.reverse().map((songDetail, i) => (
            <HistoryCard
              key={i}
              title={songDetail['songTitle']}
              composer={songDetail['songComposer']}
              difficulty={songDetail['songDifficulty']}
              date={new Intl.DateTimeFormat('en', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(songDetail.date)}
              thumbnail={songDetail['songThumbnail']}
              trackAttemptId={songDetail['trackAttemptId']}
            />
          ))
        ) : (
          <LoadingOverlayMain>
            <CircularProgress size='20vh' />
          </LoadingOverlayMain>
        )}
        {/* 
        <HistoryCard
            title={'Ode to Joy (Example - Test)'}
            composer={'Beethoven'}
            difficulty={1.2}
            trackAttemptId={'90d775a8-3cb1-4939-ab06-adadc4a98b18'}
          /> */}
      </Box>
    </Box>
  );
};

export default History;
