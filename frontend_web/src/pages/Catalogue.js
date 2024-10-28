import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavBar from '../components/nav_bar/NavBar';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ScrollContainer from 'react-indiana-drag-scroll';
import RecommendationCard from '../components/catalogue/RecommendationCard';

import defaultImg from '../assets/default-img.png';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { maxHeight, styled } from '@mui/system';

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
  position: 'absolute',
  right: '130px',
  marginTop: '2px',
});

const TopContainer = styled(Box)({
  backgroundColor: 'red',
  height: '22vw',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '20px',
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
        thumbnail={defaultImg}
        composer='Some Name'
        privacy={false}
        difficulty='7/10'
      />
    </Box>
  )
}

const Catalogue = () => {
  const [baskets, setBaskets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMusicBaskets = async () => {
      console.log("Fetching music baskets...");
      try {
        const response = await axios.get('http://localhost:5001/catalogue/basket-list', {});
        const data = response.data;
        console.log("Fetched data:", data);
        setBaskets(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMusicBaskets();
  }, []);

  const navPlaylist = () => {
    return navigate('/playlist');
  };

  return (
    <Box>
      <NavBar></NavBar>
      <Box margin='10px'>
        <StyledSearchBar id='outlined-basic' label='Search' variant='outlined' size='small'/>
        <StyledButton variant='contained' endIcon={<FilterAltIcon />}>Filter</StyledButton>

        <TopContainer>
          <Typography variant='h2'>
            Welcome back user!
          </Typography>
          <Typography variant='h4'>
            Interested in trying these songs again?
          </Typography>
          <Box display='flex' gap='2vw'>
            <RecommendationCard title='Test' thumbnail={defaultImg} composer='Test'/>
            <RecommendationCard title='Test' thumbnail={defaultImg} composer='Test2'/>
            <RecommendationCard title='Test' thumbnail={defaultImg} composer='Test3'/>
          </Box>
        </TopContainer>

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
        <PlaylistTitle title='Playlist (Public) Test >' navPlaylist={navPlaylist}/>
          <ScrollContainer>
            <Box display="flex" flexDirection="row" flexWrap="wrap">
              {baskets.filter((basket) => !basket['private']).map((basket) => (
                <SongCard
                  title={basket['title']}
                  composer={basket['composer']}
                  // genreTags={basket['genre-tags']}
                  privacy={basket['private']}
                  thumbnail={basket['thumbnail']}
                  // instrument={basket['instrument']}
                  difficulty={basket['difficulty']}
                  // instrument={basket.instrument.S}
                  // sheetKey={basket['sheet-file-key'].S}
                />
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

    </Box>
  );
};

export default Catalogue;
