import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavBar from '../components/nav_bar/NavBar';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PlaylistMainSong from '../components/playlist/PlaylistMainSong';
import SongScroll from '../components/playlist/SongScroll';
import PlaylistCard from '../components/playlist/PlaylistCard';
import ScrollContainer from 'react-indiana-drag-scroll'
import TextField from '@mui/material/TextField';

import { styled } from '@mui/system';

import defaultImg from "../assets/default-img.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Playlist page
 */
const StyledBackButton = styled(IconButton)({
  backgroundColor: '#020E37',
  color:"white",
  position:"absolute",
  left:"20px",
  marginTop:"10px",
  '&:hover': {
    backgroundColor: 'blue',
    // borderColor: '#0062cc',
    // boxShadow: 'none',
  },
});

const StyledSearchBar = styled(TextField)({
  marginBottom: "10px",
  width: "90%",
});

const Playlist = () => {
  const navigate = useNavigate();

  const navCatalogue = () => {
    return navigate('/catalogue');
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
        width="100%"
        height="80vh"
      >
        <Box
          display= 'flex'
          flex={3}
          justifyContent= 'center'
          alignItems= 'center'
        >
          <PlaylistMainSong
              title="Cold Cold Cold"
              img={defaultImg}
              artist="Cage the Elephant"
              difficulty="7/10"
          />
        </Box>
        <Box
          flex={5}
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxHeight="80vh"
          marginTop="5vh"
        >
          <StyledSearchBar id="outlined-basic" label="Search" variant="outlined"/>
            <ScrollContainer style={{ width: "100%" }}>
              <Box display="flex" flexDirection="column" width="100%" alignItems="center">
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
                <PlaylistCard></PlaylistCard>
              </Box>
            </ScrollContainer>
        </Box>
      </Box>
    </>
  );
};

export default Playlist;
