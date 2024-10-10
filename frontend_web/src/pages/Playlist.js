import { React, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

const playlistData = [
  {
    'title': 'Cold Cold Cold',
    'artist': 'Cage the Elephant',
    'difficulty': 'Hard',
  }, {
    'title': 'September',
    'artist': 'Earth, Wind & Fire',
    'difficulty': 'Hard',
  }, {
    'title': 'Budapest',
    'artist': 'George Ezra',
    'difficulty': 'Easy',
  }, {
    'title': 'How Much A Dollar Cost',
    'artist': 'Kendrick Lamar',
    'difficulty': 'Easy',
  }, {
    'title': 'Depreston',
    'artist': 'Courtney Barnett',
    'difficulty': 'Easy',
  }, {
    'title': 'Piano Man',
    'artist': 'Billy Joel',
    'difficulty': 'Medium',
  }, {
    'title': 'Dance the Night',
    'artist': 'Dua Lipa',
    'difficulty': 'Medium',
  }, {
    'title': 'Like a Prayer',
    'artist': 'Madonna',
    'difficulty': 'Easy',
  }, {
    'title': 'Cherry Bomb',
    'artist': 'The Runaways',
    'difficulty': 'Hard',
  }, {
    'title': 'Dancing Queen',
    'artist': 'ABBA',
    'difficulty': 'Hard',
  }
]

const Playlist = () => {
  const navigate = useNavigate();

  const navCatalogue = () => {
    return navigate('/catalogue');
  };

  //Allows for filtering based on search input
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredPlaylist = playlistData.filter(song => 
    song.title.toLowerCase().includes(searchInput.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchInput.toLowerCase())
  );

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
              title='Cold Cold Cold'
              img={defaultImg}
              artist='Cage the Elephant'
              difficulty='7/10'
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
                    // key={song.id} 
                    title={song.title} 
                    artist={song.artist} 
                    difficulty={song.difficulty} 
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
