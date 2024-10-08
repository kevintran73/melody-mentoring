import React from 'react';

import Box from '@mui/material/Box';
import NavBar from '../components/nav_bar/NavBar';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';

import defaultImg from "../assets/default-img.png";

/**
 * Catalogue/songs page
 */
const Catalogue = () => {
  return (
    <>
      <NavBar></NavBar>
      <Box margin="10px">
        <Typography variant='h2' marginLeft="10px"> 
          Playlist 1
        </Typography>
        <Box display="flex" flexDirection={'row'}>
          <SongCard
            title="Cold Cold Cold"
            img={defaultImg}
            artist="Cage the Elephant"
            difficulty="7/10"
          >
          </SongCard>
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          >
          </SongCard>
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
          >
          </SongCard>
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          >
          </SongCard>
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
          >
          </SongCard>
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          >
          </SongCard>
        </Box>
      </Box>
    </>
  );
};

export default Catalogue;
