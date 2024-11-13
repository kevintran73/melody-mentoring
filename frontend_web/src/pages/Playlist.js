import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../context/TokenContext';
import Box from '@mui/material/Box';
import NavBar from '../components/nav_bar/NavBar';
import IconButton from '@mui/material/IconButton';
import PlaylistMainSong from '../components/playlist/PlaylistMainSong';
import PlaylistCard from '../components/playlist/PlaylistCard';
import ScrollContainer from 'react-indiana-drag-scroll'
import TextField from '@mui/material/TextField';

import { styled } from '@mui/system';

import defaultImg from '../assets/default-img.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Playlist page
 */
const StyledBackButton = styled(IconButton)({
  backgroundColor: '#020E37',
  color:'white',
  position:'absolute',
  left:'20px',
  marginTop:'10px',
  '&:hover': {
    backgroundColor: 'blue',
    // borderColor: '#0062cc',
    // boxShadow: 'none',
  },
});

const StyledSearchBar = styled(TextField)({
  marginBottom: '10px',
  width: '90%',
});

const Playlist = () => {
  const navigate = useNavigate();

  const navCatalogue = () => {
    return navigate('/catalogue');
  };

  const params = useParams();

  const [songs, setSongs] = useState([]);
  const [mainTitle, setMainTitle] = useState('');
  const [mainImg, setMainImg] = useState('');
  const [mainArtist, setMainArtist] = useState('');
  const [mainDifficulty, setMainDifficulty] = useState('');
  const [mainSongId, setMainSongId] = useState('');
  const { accessToken, userId } = React.useContext(TokenContext);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/catalogue/songs/list-all', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSongs(response.data.songs);
        console.log(response.data.songs)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSongs();
  }, [accessToken]);

  //Allows for filtering based on search input
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredPlaylist = songs.filter(song => 
    (song.title.toLowerCase().includes(searchInput.toLowerCase()) ||
    song.composer.toLowerCase().includes(searchInput.toLowerCase())) &&
    song.genreTags.includes(params.playlistType.toLowerCase())
  );

  const selectCard = (song) => {
    setMainTitle(song['title']);
    setMainImg(song['thumbnail'] ? song['thumbnail'] : defaultImg);
    setMainArtist(song['composer'] ? song['composer'] : 'Unknown');
    setMainDifficulty(song['difficulty']);
    setMainSongId(song['id']);
  };

  return (
    <>
      <NavBar></NavBar>
      <StyledBackButton onClick={navCatalogue}>
        <ArrowBackIcon />
      </StyledBackButton>
      <Box
        display= 'flex'
        flexDirection= 'row'
        justifyContent= 'space-evenly'
        alignItems= 'stretch'
        width='100%'
        height='80vh'
      >
        <Box
          display= 'flex'
          flex={3}
          justifyContent= 'center'
          alignItems= 'center'
        >
          <PlaylistMainSong
            title={mainTitle ? mainTitle : 'Select a Song'}
            img={mainImg ? mainImg : defaultImg}
            artist={mainArtist ? mainArtist : 'Artist'}
            difficulty={mainDifficulty ? mainDifficulty : 'N/A'}
            songId={mainSongId}
          />
        </Box>
        <Box
          flex={5}
          display='flex'
          flexDirection='column'
          alignItems='center'
          maxHeight='80vh'
          marginTop='5vh'
        >
          <StyledSearchBar id='outlined-basic' label='Search' variant='outlined' onChange={handleSearchChange} value={searchInput}/>
            <ScrollContainer style={{ width: '100%' }}>
              <Box display='flex' flexDirection='column' width='100%' alignItems='center'>
                {filteredPlaylist.map((song) => (
                  <PlaylistCard 
                    title={song['title']} 
                    thumbnail={(song['thumbnail'])}
                    composer={song['composer'] ? song['composer'] : 'Unknown'}
                    difficulty={song['difficulty']} 
                    onClick={() => selectCard(song)}
                  />
                ))}
              </Box>
            </ScrollContainer>
        </Box>
      </Box>
    </>
  );
};

export default Playlist;
