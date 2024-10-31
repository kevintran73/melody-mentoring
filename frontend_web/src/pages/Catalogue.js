import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavBar from '../components/nav_bar/NavBar';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ScrollContainer from 'react-indiana-drag-scroll';
import RecommendationCard from '../components/catalogue/RecommendationCard';
import TokenContext from '../context/TokenContext';
import Card from '@mui/material/Card';

import defaultImg from '../assets/default-img.png';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { maxHeight, styled } from '@mui/system';

/**
 * Catalogue/songs page
 */

const StyledButton = styled(Button)({
  width: '100px',
  backgroundColor: '#2C2C2C',
  fontSize: '1rem',
  padding: '8px 8px',
  position: 'absolute',
  right: '10px',
  marginTop: '0px',
  textTransform: 'none',
});

const StyledSearchBar = styled(TextField)({
  position: 'absolute',
  right: '130px',
  marginTop: '2px',
});

const TopContainer = styled(Card)({
  // backgroundColor: 'red',
  height: '24vw',
  width: '60%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '20px',
  position: 'relative',
  left: '20%',
  margin: '20px 0px'
  // top: '20%',
  // margin: '20px',
});

const PlaylistTitle = ({ title, navPlaylist }) => (
  <Typography
    fontSize='2.0rem'
    marginLeft='10px'
    sx={{ cursor: 'pointer', display: 'inline' }}
    onClick={navPlaylist}
  >
    {title}
  </Typography>
);

const SongCardTemplate = () => {
  return (
    <Box>
      <SongCard
        title='Song Title'
        thumbnail={defaultImg}
        composer='Some Name'
        privacy={false}
        difficulty='3'
        genreTags={['pop', '70s']}
      />
    </Box>
  );
};

const Catalogue = () => {
  const [songs, setSongs] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const token = useContext(TokenContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/auth/validate-token', {
          headers: {
            Authorization: `Bearer ${token['accessToken']}`,
          },
        });
        setUserData(response.data.user);
        console.log(response.data.user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/catalogue/songs/list-all', {
          headers: {
            Authorization: `Bearer ${token['accessToken']}`,
          },
        });
        const data = response.data.songs;
        setSongs(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
    fetchSongs();
  }, [token]);

  const navPlaylist = () => {
    return navigate('/playlist');
  };

  return (
    <Box backgroundColor='#f9f9f9'>
      <NavBar></NavBar>
      <Box margin='10px'>
      <StyledSearchBar id='outlined-basic' label='Search' variant='outlined' size='small' />
        <StyledButton variant='contained' endIcon={<FilterAltIcon />}>
          Filter
        </StyledButton>
        </Box>
      <Box margin='60px 20px'>


        {/* Welcome container */}
        <TopContainer>
          <Typography variant='h2'>
            Welcome back, {userData ? userData['Username'] : 'N/A'}!
          </Typography>
          <Typography variant='h4'>Interested in trying these songs again?</Typography>
          <Box display='flex' gap='2vw'>
            <RecommendationCard title='Test' thumbnail={defaultImg} composer='Test' />
            <RecommendationCard title='Test' thumbnail={defaultImg} composer='Test2' />
            <RecommendationCard title='Test' thumbnail={defaultImg} composer='Test3' />
          </Box>
        </TopContainer>

        {/* Playlist Uploaded */}
        <Box>
          <PlaylistTitle title='Your Uploaded Songs >' navPlaylist={navPlaylist} />
          <ScrollContainer>
            <Box display='flex' flexDirection='row' flexWrap='wrap'>
              {songs
                .filter((song) => song['private'])
                .map((song, i) => (
                  <SongCard
                    title={song['title']}
                    composer={song['composer']}
                    privacy={song['private']}
                    thumbnail={song['thumbnail']}
                    difficulty={song['difficulty']}
                    genreTags={song['genreTags']}
                    songId={song['id']}
                  />
                ))}
            </Box>
          </ScrollContainer>
        </Box>

        {/* Playlist 1 */}
        <Box>
          <PlaylistTitle title='Playlist 1 >' navPlaylist={navPlaylist} />
          <ScrollContainer>
            <Box display='flex' flexDirection={'row'}>
              {Array.apply(null, { length: 15 }).map((i) => (
                <SongCardTemplate key={i}></SongCardTemplate>
              ))}
            </Box>
          </ScrollContainer>
        </Box>
      </Box>

      {/* Playlist 70s */}
      <Box margin='10px'>
        <PlaylistTitle title='70s Playlist >' navPlaylist={navPlaylist} />
        <ScrollContainer>
          <Box display='flex' flexDirection='row'>
            {songs
              .filter((song) => !song['private'] && song.genreTags.includes('70s'))
              .map((song) => (
                <Box>
                  <SongCard
                    title={song['title']}
                    composer={song['composer']}
                    privacy={song['private']}
                    thumbnail={song['thumbnail']}
                    difficulty={song['difficulty']}
                    genreTags={song['genreTags']}
                    songId={song['id']}
                  />
                </Box>
              ))}
          </Box>
        </ScrollContainer>
      </Box>

      {/* Playlist Pop */}
      <Box margin='10px'>
        <PlaylistTitle title='Pop Playlist >' navPlaylist={navPlaylist} />
        <ScrollContainer>
          <Box display='flex' flexDirection='row'>
            {songs
              .filter((song) => !song['private'] && song.genreTags.includes('pop'))
              .map((song) => (
                <Box>
                  <SongCard
                    title={song['title']}
                    composer={song['composer']}
                    privacy={song['private']}
                    thumbnail={song['thumbnail']}
                    difficulty={song['difficulty']}
                    genreTags={song['genreTags']}
                    songId={song['id']}
                  />
                </Box>
              ))}
          </Box>
        </ScrollContainer>
      </Box>

      {/* Playlist Public */}
      <Box margin='10px'>
        <PlaylistTitle title='Playlist (Public) Test >' navPlaylist={navPlaylist} />
        <ScrollContainer>
          <Box display='flex' flexDirection='row'>
            {songs
              .filter((song) => !song['private'])
              .map((song) => (
                <Box>
                  <SongCard
                    title={song['title']}
                    composer={song['composer']}
                    privacy={song['private']}
                    thumbnail={song['thumbnail']}
                    difficulty={song['difficulty']}
                    genreTags={song['genreTags']}
                    songId={song['id']}
                  />
                </Box>
              ))}
          </Box>
        </ScrollContainer>
      </Box>

      {/* Playlist 3 */}
      <Box margin='10px'>
        <PlaylistTitle title='Playlist 3 >' navPlaylist={navPlaylist} />
        <ScrollContainer>
          <Box display='flex' flexDirection={'row'}>
            {Array.apply(null, { length: 15 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
    </Box>
  );
};

export default Catalogue;
