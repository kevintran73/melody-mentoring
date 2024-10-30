import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavBar from '../components/nav_bar/NavBar';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ScrollContainer from 'react-indiana-drag-scroll'

import defaultImg from '../assets/default-img.png';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { maxHeight, styled } from '@mui/system';
import Students from '../components/tutor_interface/Students';

import TokenContext from '../context/TokenContext';
import axios from 'axios';
import { showErrorMessage } from '../helpers';

/**
 * Catalogue/songs page
 */

const StyledButton = styled(Button)({
  width: '100px',
  backgroundColor: '#2C2C2C',
  fontSize: '1rem',
  padding: '8px 8px',
  position:'absolute',
  right:'10px',
  marginTop:'0px',
  textTransform: 'none',
});

const StyledSearchBar = styled(TextField)({
  position:'absolute',
  right:'130px',
  marginTop:'2px',
});

const PlaylistTitle = ({ title, navPlaylist }) => (
  <Typography
    fontSize='2.0rem'
    marginLeft='10px'
    sx={{ cursor: 'pointer', display: 'inline' }}
    onClick={navPlaylist}
  >
    {title}
  </Typography>
);

const SongCardTemplate = () => {
  return (
    <Box>
      <SongCard 
        title='Song Title'
        img={defaultImg}
        artist='Artist Name'
        difficulty='7/10'
      />
    </Box>
  )
}

const Catalogue = () => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState(null)
  const { userId, accessToken } = React.useContext(TokenContext);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Attach token to the headers
          },
        });
        setRole(response.data.role)  // get the role of the user and render the components accordingly
      } catch (err) {
        showErrorMessage(err.response.data.error);
      }
    }
    fetchData()
  }, []);

  const navPlaylist = () => {
    return navigate('/playlist');
  };

  return (
    <Box>
      <NavBar></NavBar>
      {role === 'student' && <>
        <Box margin='10px'>
        <StyledSearchBar id='outlined-basic' label='Search' variant='outlined' size='small'/>
        <StyledButton variant='contained' endIcon={<FilterAltIcon />}>Filter</StyledButton>
        <PlaylistTitle title='Playlist 1 >' navPlaylist={navPlaylist}/>
        <ScrollContainer>
          <Box display='flex' flexDirection={'row'}>
            {Array.apply(null, { length: 15 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
      <Box margin='10px'>
        <PlaylistTitle title='Playlist 2 >' navPlaylist={navPlaylist}/>
        <ScrollContainer>
          <Box display='flex' flexDirection={'row'}>
            {Array.apply(null, { length: 8 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
      <Box margin='10px'>
        <PlaylistTitle title='Playlist 3 >' navPlaylist={navPlaylist}/>
        <ScrollContainer>
          <Box display='flex' flexDirection={'row'}>
            {Array.apply(null, { length: 15 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
      <Box margin='10px'>
        <PlaylistTitle title='Playlist 4 >' navPlaylist={navPlaylist} gap={0}/>
        <ScrollContainer>
          <Box display='flex' flexDirection={'row'} justifyContent={'flex-start'}>
            {Array.apply(null, { length: 5 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
      <Box margin='10px'>
        <PlaylistTitle title='Playlist 5 >' navPlaylist={navPlaylist}/>
        <ScrollContainer>
          <Box display='flex' flexDirection={'row'}>
            {Array.apply(null, { length: 14 }).map((i) => (
              <SongCardTemplate key={i}></SongCardTemplate>
            ))}
          </Box>
        </ScrollContainer>
      </Box>
      </>}

      {role === 'tutor' && <>
        <Students />
      </>}

    </Box>
  );
};

export default Catalogue;
