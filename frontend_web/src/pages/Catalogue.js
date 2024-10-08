import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import NavBar from '../components/nav_bar/NavBar';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';

import defaultImg from "../assets/default-img.png";

/**
 * Catalogue/songs page
 */
const Catalogue = () => {
  const navigate = useNavigate();

  const navPlaylist = () => {
    return navigate('/playlist');
  };

  return (
    <>
      <NavBar></NavBar>
      <Box margin="10px">
        <Typography variant='h2' marginLeft="10px" onClick={navPlaylist} sx={{ cursor: 'pointer' }}> 
          Playlist 1 {'>'}
        </Typography>
        <Box display="flex" flexDirection={'row'} flexShrink={0}>
          <SongCard
            title="Cold Cold Cold"
            img={defaultImg}
            artist="Cage the Elephant"
            difficulty="7/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Cold Cold Cold"
            img={defaultImg}
            artist="Cage the Elephant"
            difficulty="7/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
        </Box>
      </Box>
      <Box margin="10px">
        <Typography variant='h2' marginLeft="10px"> 
          Playlist 2
        </Typography>
        <Box display="flex" flexDirection={'row'}>
          <SongCard
            title="Cold Cold Cold"
            img={defaultImg}
            artist="Cage the Elephant"
            difficulty="7/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
        </Box>
      </Box>
      <Box margin="10px">
        <Typography variant='h2' marginLeft="10px"> 
          Playlist 3
        </Typography>
        <Box display="flex" flexDirection={'row'}>
          <SongCard
            title="Cold Cold Cold"
            img={defaultImg}
            artist="Cage the Elephant"
            difficulty="7/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
        </Box>
      </Box>
    </>
  );
};

export default Catalogue;
