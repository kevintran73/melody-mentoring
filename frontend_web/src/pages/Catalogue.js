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

const PlaylistTitle = ({ title, navPlaylist }) => (
    <Typography
      fontSize="2.2rem"
      marginLeft="10px"
      sx={{ cursor: "pointer", display: "inline" }}
      onClick={navPlaylist}
    >
      {title}
    </Typography>
);

const Catalogue = () => {
  const navigate = useNavigate();

  const navPlaylist = () => {
    return navigate('/playlist');
  };

  return (
    <>
      <NavBar></NavBar>
      <Box margin="10px">
        <PlaylistTitle title="Playlist 1 >" navPlaylist={navPlaylist}/>
        <Box display="flex" flexDirection={'row'} overflow="scroll">
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
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
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
        <PlaylistTitle title="Playlist 2 >" navPlaylist={navPlaylist}/>
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
        <PlaylistTitle title="Playlist 3 >" navPlaylist={navPlaylist}/>
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
        <PlaylistTitle title="Playlist 1 >" navPlaylist={navPlaylist}/>
        <Box display="flex" flexDirection={'row'} overflow="scroll">
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
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
          />
          <SongCard
            title="Avant Gardener"
            img={defaultImg}
            artist="Courtney Barnett"
            difficulty="5/10"
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
