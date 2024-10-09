import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavBar from '../components/nav_bar/NavBar';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ScrollContainer from 'react-indiana-drag-scroll'

import defaultImg from "../assets/default-img.png";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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

const SongCardTemplate = () => {
  return (
    <SongCard
      title="Song Title"
      img={defaultImg}
      artist="Artist Name"
      difficulty="7/10"
    />
)
}

const Catalogue = () => {
  const navigate = useNavigate();

  const navPlaylist = () => {
    return navigate('/playlist');
  };

  return (
    <Box>
      <NavBar></NavBar>
      <Box margin="10px">
        <StyledSearchBar id="outlined-basic" label="Search" variant="outlined" size="small"/>
        <StyledButton variant="contained" endIcon={<FilterAltIcon />}>Filter</StyledButton>
        <PlaylistTitle title="Playlist 1 >" navPlaylist={navPlaylist}/>
        <ScrollContainer>
          <Box display="flex" flexDirection={'row'}>
            {Array.apply(null, { length: 15 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
      <Box margin="10px">
        <PlaylistTitle title="Playlist 2 >" navPlaylist={navPlaylist}/>
        <ScrollContainer>
          <Box display="flex" flexDirection={'row'}>
            {Array.apply(null, { length: 8 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
      <Box margin="10px">
        <PlaylistTitle title="Playlist 3 >" navPlaylist={navPlaylist}/>
        <ScrollContainer>
          <Box display="flex" flexDirection={'row'}>
            {Array.apply(null, { length: 15 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
      <Box margin="10px">
        <PlaylistTitle title="Playlist 4 >" navPlaylist={navPlaylist}/>
        <ScrollContainer>
          <Box display="flex" flexDirection={'row'}>
            {Array.apply(null, { length: 7 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
      <Box margin="10px">
        <PlaylistTitle title="Playlist 5 >" navPlaylist={navPlaylist}/>
        <ScrollContainer>
          <Box display="flex" flexDirection={'row'}>
            {Array.apply(null, { length: 14 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
    </Box>
  );
};

export default Catalogue;
