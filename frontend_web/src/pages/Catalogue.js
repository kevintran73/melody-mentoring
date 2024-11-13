import React, { useEffect, useState } from 'react';
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
import { showErrorMessage } from '../helpers';

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
  height: '24vw',
  width: '60%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '20px',
  position: 'relative',
  left: '20%',
  margin: '20px 0px',
});

const PlaylistButton = styled(Button)({
  // width: '100px',
  backgroundColor: '#020E37',
  color: 'white',
  fontSize: '1.6rem',
  margin: '10px 0px 5px 10px',
  textTransform: 'none',
});

const PlaylistTitle = ({ title, navPlaylist }) => (
  <PlaylistButton variant='secondary' onClick={navPlaylist}>
    {title}
  </PlaylistButton>
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
  const [favouritedSongs, setFavouritedSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  const { accessToken, userId } = React.useContext(TokenContext);

  useEffect(() => {
    if (!accessToken || !userId) {
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user data
        const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data);

        // Fetch favourited songs concurrently
        const favouriteSongIds = response.data.favourite_songs;
        const songFetchPromises = favouriteSongIds.map((favouritedSongId) =>
          axios.get(`http://localhost:5001/catalogue/songs/find/${favouritedSongId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        );
        const songInfoResponses = await Promise.all(songFetchPromises);
        const favouriteSongs = songInfoResponses.map((songInfoResponse) => songInfoResponse.data);
        setFavouritedSongs(favouriteSongs);
      } catch (error) {
        console.error('Error fetching user details or favourite songs:', error);
        showErrorMessage(error.response?.data?.error || 'An error occurred');
      }
    };

    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/catalogue/songs/list-all', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        setSongs(response.data.songs);

        // Get random songs to recommend
        const shuffledSongs = response.data.songs.slice().sort(() => 0.5 - Math.random());
        setRecommendations(shuffledSongs.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
    fetchSongs();
  }, [accessToken, userId]);

  const navPlaylist = (playlistType) => {
    return navigate(`/playlist/${playlistType}`);
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

      {/* Welcome container */}
      <Box margin='60px 20px'>
        <TopContainer>
          <Typography variant='h2'>
            Welcome back, {userData ? userData['username'] : 'N/A'}!
          </Typography>
          <Typography variant='h4'>Interested in trying these songs again?</Typography>
          <Box display='flex' gap='2vw'>
            {recommendations.map((song, i) => (
              <RecommendationCard
                key={`recommendation-card-${i}`}
                songId={song['id']}
                title={song['title']}
                thumbnail={song['thumbnail']}
                composer={song['composer']}
              />
            ))}
          </Box>
        </TopContainer>
      </Box>

      {/* Playlist Favourited */}
      {favouritedSongs.length !== 0 && (
        <Box margin='10px'>
          <PlaylistTitle
            title='Your Favourited Songs >'
            navPlaylist={() => navPlaylist('favourites')}
          />
          <ScrollContainer>
            <Box display='flex' flexDirection='row'>
              {favouritedSongs.map((song, i) => (
                <Box key={`box-favourited-${song['title']}-${i}`}>
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
      )}

      {/* Playlist Uploaded */}
      {songs.filter((song) => song['private'] && song['uploaderId'] === userId).length !== 0 && (
        <Box margin='10px'>
          <PlaylistTitle
            title='Your Uploaded Songs >'
            navPlaylist={() => navPlaylist('uploaded')}
          />
          <ScrollContainer>
            <Box display='flex' flexDirection='row'>
              {songs
                .filter((song) => song['private'] && song['uploaderId'] === userId)
                .map((song, i) => (
                  <Box key={`box-uploaded-private-${song['title']}-${i}`}>
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
      )}

      {/* Playlist Uploaded (Everyone) */}
      <Box margin='10px'>
        <PlaylistTitle
          title='Uploaded Songs (Everyone) >'
          navPlaylist={() => navPlaylist('uploaded')}
        />
        <ScrollContainer>
          <Box display='flex' flexDirection='row'>
            {songs
              .filter((song) => song['private'])
              .map((song, i) => (
                <Box key={`box-uploaded-everyone-${song['title']}-${i}`}>
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

      {/* Playlist 70s */}
      <Box margin='10px'>
        <PlaylistTitle title='70s Playlist >' navPlaylist={() => navPlaylist('70s')} />
        <ScrollContainer>
          <Box display='flex' flexDirection='row'>
            {songs
              .filter((song) => !song['private'] && song.genreTags.includes('70s'))
              .map((song, i) => (
                <Box key={`box-70s-${song['title']}-${i}`}>
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
        <PlaylistTitle title='Pop Playlist >' navPlaylist={() => navPlaylist('pop')} />
        <ScrollContainer>
          <Box display='flex' flexDirection='row'>
            {songs
              .filter((song) => !song['private'] && song.genreTags.includes('pop'))
              .map((song, i) => (
                <Box key={`box-pop-${song['title']}-${i}`}>
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

      {/* Playlist Rock
      <Box margin='10px'>
        <PlaylistTitle title='Rock Playlist >' navPlaylist={() => navPlaylist("rock")} />
        <ScrollContainer>
          <Box display='flex' flexDirection='row'>
            {songs
              .filter((song) => !song['private'] && song.genreTags.includes('rock'))
              .map((song, i) => (
                <Box key={`box-rock-${song['title']}-${i}`}>
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
      </Box> */}

      {/* Playlist Public */}
      <Box margin='10px'>
        <PlaylistTitle title='Playlist (Public) Test >' navPlaylist={() => navPlaylist('public')} />
        <ScrollContainer>
          <Box display='flex' flexDirection='row'>
            {songs
              .filter((song) => !song['private'])
              .map((song, i) => (
                <Box key={`box-public-${song['title']}-${i}`}>
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

      {/* Playlist 1 */}
      <Box margin='10px'>
        <PlaylistTitle title='Playlist 1 (Default) >' navPlaylist={navPlaylist} />
        <ScrollContainer>
          <Box display='flex' flexDirection={'row'}>
            {Array.apply(null, { length: 15 }).map((_, i) => (
              <SongCardTemplate key={`playlist-1-${i}`}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>

      {/* Playlist 2 */}
      <Box margin='10px'>
        <PlaylistTitle title='Playlist 2 (Default) >' navPlaylist={navPlaylist} />
        <ScrollContainer>
          <Box display='flex' flexDirection={'row'}>
            {Array.apply(null, { length: 15 }).map((_, i) => (
              <SongCardTemplate key={`playlist-2-${i}`}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
    </Box>
  );
};

export default Catalogue;
