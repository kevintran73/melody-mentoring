import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import NavBar from '../components/nav_bar/NavBar';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';
import PlaylistMainSong from '../components/playlist/PlaylistMainSong';
import SongScroll from '../components/playlist/SongScroll';

import defaultImg from "../assets/default-img.png";

/**
 * Playlist page
 */
const Playlist = () => {
  return (
    <>
      <NavBar></NavBar>
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
          flex={1}
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
        <Box display= 'flex' flex={1} justifyContent= 'center' alignItems= 'center'>
          <SongScroll></SongScroll>
        </Box>
      </Box>
    </>
  );
};

export default Playlist;
