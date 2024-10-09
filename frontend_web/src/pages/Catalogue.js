import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavBar from '../components/nav_bar/NavBar';
import SendIcon from '@mui/icons-material/Send';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import defaultImg from "../assets/default-img.png";

import { styled } from '@mui/system';

/**
 * Catalogue/songs page
 */

const StyledButton = styled(Button)({
  width: '100px',
  backgroundColor: '#2C2C2C',
  fontSize: '1rem',
  padding: '8px 8px',
  position:"absolute",
  right:"10px",
  marginTop:"0px",
  textTransform: 'none',
});

const StyledSearchBar = styled(TextField)({
  position:"absolute",
  right:"130px",
  marginTop:"2px",
});

const PlaylistTitle = ({ title, navPlaylist }) => (
    <Typography
      fontSize="2.0rem"
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
        <StyledSearchBar id="outlined-basic" label="Outlined" variant="outlined" size="small"/>
        <StyledButton variant="contained" endIcon={<SendIcon />}>Filter</StyledButton>
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
        <PlaylistTitle title="Playlist 4 >" navPlaylist={navPlaylist}/>
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
