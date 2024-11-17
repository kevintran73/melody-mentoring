import { CircularProgress, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryCard from '../components/history/HistoryCard';
import HistoryIntroCard from '../components/history/HistoryIntroCard';
import NavBar from '../components/nav_bar/NavBar';
import TokenContext from '../context/TokenContext';

/**
 * History page
 */

const StyledTopContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  margin: '2vw 10vw',
  height: '300px',
  gap: '1vw',
}));

const StyledSearchBar = styled(TextField)({
  marginBottom: '10px',
  width: '90%',
  width: '100%',
  borderRadius: '8px',
  marginBottom: '30px',
  backgroundColor: 'white',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
});

const LoadingOverlayMain = styled(Box)({
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
        const response = await axios.get(
          `http://localhost:5001/track-attempt/history/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Sorts songs by most recent upload time
        setSongDetails(
          response.data.sort(
            (a, b) => new Date(b.isoUploadTime) - new Date(a.isoUploadTime)
          )
        );
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

      {/* Greeting element */}
      <StyledTopContainer>
        <HistoryIntroCard />
      </StyledTopContainer>

      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        marginX='10vw'
      >
        {/* Searchbar for filtering track attempts */}
        <StyledSearchBar
          id='outlined-basic'
          label='Search'
          variant='outlined'
          onChange={handleSearchChange}
          value={searchInput}
        />

        {/* List of track attempts */}
        {filteredTracks.length > 0 ? (
          filteredTracks.map((songDetail, i) => (
            <HistoryCard
              key={i}
              title={songDetail['songTitle']}
              composer={songDetail['songComposer']}
              difficulty={songDetail['songDifficulty']}
              date={new Intl.DateTimeFormat('en', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              }).format(new Date(songDetail['isoUploadTime']))}
              thumbnail={songDetail['songThumbnail']}
              trackAttemptId={songDetail['trackAttemptId']}
            />
          ))
        ) : (
          <LoadingOverlayMain>
            <CircularProgress size='20vh' />
          </LoadingOverlayMain>
        )}
      </Box>
    </Box>
  );
};

export default History;
