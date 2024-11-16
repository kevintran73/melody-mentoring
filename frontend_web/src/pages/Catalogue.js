import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavBar from '../components/nav_bar/NavBar';
import SongCard from '../components/catalogue/SongCard';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ScrollContainer from 'react-indiana-drag-scroll';
import RecommendationCard from '../components/catalogue/RecommendationCard';
import TokenContext from '../context/TokenContext';
import Card from '@mui/material/Card';

import defaultImg from '../assets/default-img.png';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { maxHeight, styled } from '@mui/system';
import { showErrorMessage } from '../helpers';
import SearchResults from '../components/catalogue/SearchResults';

/**
 * Catalogue/songs page
 */

const StyledButton = styled(Button)({
  width: '100px',
  backgroundColor: '#2C2C2C',
  fontSize: '1rem',
  padding: '8px 8px',
  position: 'absolute',
  right: '10px',
  marginTop: '0px',
  textTransform: 'none',
});

const StyledSearchBar = styled(TextField)({
  position: 'absolute',
  right: '130px',
  marginTop: '2px',
});

const TopContainer = styled(Card)({
  height: '24vw',
  width: '60%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '20px',
  position: 'relative',
  left: '20%',
  margin: '20px 0px',
});

const PlaylistButton = styled(Button)({
  // width: '100px',
  backgroundColor: '#020E37',
  color: 'white',
  fontSize: '1.6rem',
  margin: '10px 0px 5px 10px',
  textTransform: 'none',
});

const PlaylistTitle = ({ title, navPlaylist }) => (
  <PlaylistButton variant='secondary' onClick={navPlaylist}>
    {title}
  </PlaylistButton>
);

const StyledSearchForm = styled('div')({
  margin: '10px',
});

const Catalogue = () => {
  const [songs, setSongs] = useState([]);
  const [favouritedSongs, setFavouritedSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  const { accessToken, userId } = React.useContext(TokenContext);

  // Search functionality
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [lastKey, setLastKey] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = React.useState(false);
  const [hasMoreResults, setHasMoreResults] = React.useState(true);

  useEffect(() => {
    // Navigate to login if invalid token or user id
    if (accessToken === null || !userId) {
      return navigate('/login');
    }

    const fetchSongData = async () => {
      const response = await axios.get(`http://localhost:5001/catalague/user-catalogue/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setSongs(response.data);

      // Get random songs to recommend
      const shuffledSongs = response.data.slice().sort(() => 0.5 - Math.random());
      setRecommendations(shuffledSongs.slice(0, 3));
    };

    fetchSongData();
  }, [accessToken, userId, navigate]);

  const navPlaylist = (playlistType) => {
    return navigate(`/playlist/${playlistType}`);
  };

  // On query change
  const onQueryChange = (q) => {
    setIsSearching(false);
    setLastKey(null);
    setHasMoreResults(true);
    setSearchResults([]);
    setQuery(q.target.value);
  };

  // Search for songs
  const searchSongs = async () => {
    if (loadingSearch || !hasMoreResults) {
      return;
    }

    setLoadingSearch(true);
    setIsSearching(true);

    const params = { query, user_id: userId };
    if (lastKey) {
      params.last_key = lastKey;
    }
    try {
      const response = await axios.get(`http://localhost:5001/catalogue/query`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      setSearchResults((prev) => [...prev, ...response.data.songs]);
      setLastKey(response.data.last_key);
      setLoadingSearch(false);
      setHasMoreResults(response.data.last_key);
    } catch (err) {
      showErrorMessage(err.response.data.error);
    }
  };

  return (
    <Box backgroundColor='#f9f9f9'>
      <NavBar></NavBar>

      {songs.length > 0 && (
        <StyledSearchForm noValidate>
          <StyledSearchBar
            id='outlined-basic'
            label='Search'
            variant='outlined'
            size='small'
            value={query}
            onChange={onQueryChange}
          />
          <StyledButton onClick={searchSongs} variant='contained' endIcon={<FilterAltIcon />}>
            Filter
          </StyledButton>
        </StyledSearchForm>
      )}

      {searchResults.length === 0 && !isSearching ? (
        <>
          {/* Welcome container */}
          <Box margin='60px 20px'>
            <TopContainer>
              <Typography variant='h3'>Welcome back!</Typography>
              {recommendations.length > 0 && (
                <>
                  <Typography variant='h4'>Songs that might interest you:</Typography>
                  <Box display='flex' gap='2vw'>
                    {recommendations.map((song, i) => (
                      <RecommendationCard
                        key={`recommendation-card-${i}`}
                        songId={song['id']}
                        title={song['title']}
                        thumbnail={song['thumbnail']}
                        composer={song['composer']}
                      />
                    ))}
                  </Box>
                </>
              )}
            </TopContainer>
          </Box>

          {/* Playlist Favourited */}
          {favouritedSongs.length !== 0 && (
            <Box margin='10px'>
              <PlaylistTitle
                title='Your Favourited Songs >'
                navPlaylist={() => navPlaylist('favourites')}
              />
              <ScrollContainer>
                <Box display='flex' flexDirection='row'>
                  {favouritedSongs.map((song, i) => (
                    <Box key={`box-favourited-${song['title']}-${i}`}>
                      <SongCard
                        title={song['title']}
                        composer={song['composer']}
                        privacy={song['private']}
                        thumbnail={song['thumbnail']}
                        difficulty={song['difficulty']}
                        genreTags={song['genreTags']}
                        songId={song['id']}
                      />
                    </Box>
                  ))}
                </Box>
              </ScrollContainer>
            </Box>
          )}

          {/* Playlist Uploaded */}
          {songs.filter((song) => song['private'] && song['uploaderId'] === userId).length !==
            0 && (
            <Box margin='10px'>
              <PlaylistTitle
                title='Your Uploaded Songs >'
                navPlaylist={() => navPlaylist('uploaded')}
              />
              <ScrollContainer>
                <Box display='flex' flexDirection='row'>
                  {songs
                    .filter((song) => song['private'] && song['uploaderId'] === userId)
                    .map((song, i) => (
                      <Box key={`box-uploaded-private-${song['title']}-${i}`}>
                        <SongCard
                          title={song['title']}
                          composer={song['composer']}
                          privacy={song['private']}
                          thumbnail={song['thumbnail']}
                          difficulty={song['difficulty']}
                          genreTags={song['genreTags']}
                          songId={song['id']}
                        />
                      </Box>
                    ))}
                </Box>
              </ScrollContainer>
            </Box>
          )}

          {/* Playlist Rock */}
          {songs.filter(
            (song) =>
              (!song['private'] || song['uploaderId'] === userId) && song.genreTags.includes('rock')
          ).length > 0 && (
            <Box margin='10px'>
              <PlaylistTitle title='Rock Playlist >' navPlaylist={() => navPlaylist('rock')} />
              <ScrollContainer>
                <Box display='flex' flexDirection='row'>
                  {songs
                    .filter(
                      (song) =>
                        (!song['private'] || song['uploaderId'] === userId) &&
                        song.genreTags.includes('rock')
                    )
                    .map((song, i) => (
                      <Box key={`box-rock-${song['title']}-${i}`}>
                        <SongCard
                          title={song['title']}
                          composer={song['composer']}
                          privacy={song['private']}
                          thumbnail={song['thumbnail']}
                          difficulty={song['difficulty']}
                          genreTags={song['genreTags']}
                          songId={song['id']}
                        />
                      </Box>
                    ))}
                </Box>
              </ScrollContainer>
            </Box>
          )}

          {/* Playlist Pop */}
          {songs.filter(
            (song) =>
              (!song['private'] || song['uploaderId'] === userId) && song.genreTags.includes('pop')
          ).length > 0 && (
            <Box margin='10px'>
              <PlaylistTitle title='Pop Playlist >' navPlaylist={() => navPlaylist('pop')} />
              <ScrollContainer>
                <Box display='flex' flexDirection='row'>
                  {songs
                    .filter(
                      (song) =>
                        (!song['private'] || song['uploaderId'] === userId) &&
                        song.genreTags.includes('pop')
                    )
                    .map((song, i) => (
                      <Box key={`box-pop-${song['title']}-${i}`}>
                        <SongCard
                          title={song['title']}
                          composer={song['composer']}
                          privacy={song['private']}
                          thumbnail={song['thumbnail']}
                          difficulty={song['difficulty']}
                          genreTags={song['genreTags']}
                          songId={song['id']}
                        />
                      </Box>
                    ))}
                </Box>
              </ScrollContainer>
            </Box>
          )}

          {/* Playlist Jazz */}
          {songs.filter(
            (song) =>
              (!song['private'] || song['uploaderId'] === userId) && song.genreTags.includes('jazz')
          ).length > 0 && (
            <Box margin='10px'>
              <PlaylistTitle title='Jazz Playlist >' navPlaylist={() => navPlaylist('jazz')} />
              <ScrollContainer>
                <Box display='flex' flexDirection='row'>
                  {songs
                    .filter(
                      (song) =>
                        (!song['private'] || song['uploaderId'] === userId) &&
                        song.genreTags.includes('jazz')
                    )
                    .map((song, i) => (
                      <Box key={`box-jazz-${song['title']}-${i}`}>
                        <SongCard
                          title={song['title']}
                          composer={song['composer']}
                          privacy={song['private']}
                          thumbnail={song['thumbnail']}
                          difficulty={song['difficulty']}
                          genreTags={song['genreTags']}
                          songId={song['id']}
                        />
                      </Box>
                    ))}
                </Box>
              </ScrollContainer>
            </Box>
          )}

          {/* Playlist Classical */}
          {songs.filter(
            (song) =>
              (!song['private'] || song['uploaderId'] === userId) &&
              song.genreTags.includes('classical')
          ).length > 0 && (
            <Box margin='10px'>
              <PlaylistTitle
                title='Classical Playlist >'
                navPlaylist={() => navPlaylist('classical')}
              />
              <ScrollContainer>
                <Box display='flex' flexDirection='row'>
                  {songs
                    .filter(
                      (song) =>
                        (!song['private'] || song['uploaderId'] === userId) &&
                        song.genreTags.includes('classical')
                    )
                    .map((song, i) => (
                      <Box key={`box-classical-${song['title']}-${i}`}>
                        <SongCard
                          title={song['title']}
                          composer={song['composer']}
                          privacy={song['private']}
                          thumbnail={song['thumbnail']}
                          difficulty={song['difficulty']}
                          genreTags={song['genreTags']}
                          songId={song['id']}
                        />
                      </Box>
                    ))}
                </Box>
              </ScrollContainer>
            </Box>
          )}

          {/* Playlist Score */}
          {songs.filter(
            (song) =>
              (!song['private'] || song['uploaderId'] === userId) &&
              song.genreTags.includes('score')
          ).length > 0 && (
            <Box margin='10px'>
              <PlaylistTitle title='Score Playlist >' navPlaylist={() => navPlaylist('score')} />
              <ScrollContainer>
                <Box display='flex' flexDirection='row'>
                  {songs
                    .filter(
                      (song) =>
                        (!song['private'] || song['uploaderId'] === userId) &&
                        song.genreTags.includes('score')
                    )
                    .map((song, i) => (
                      <Box key={`box-score-${song['title']}-${i}`}>
                        <SongCard
                          title={song['title']}
                          composer={song['composer']}
                          privacy={song['private']}
                          thumbnail={song['thumbnail']}
                          difficulty={song['difficulty']}
                          genreTags={song['genreTags']}
                          songId={song['id']}
                        />
                      </Box>
                    ))}
                </Box>
              </ScrollContainer>
            </Box>
          )}

          {/* Playlist Other */}
          {songs.filter(
            (song) =>
              (!song['private'] || song['uploaderId'] === userId) &&
              song.genreTags.includes('other')
          ).length > 0 && (
            <Box margin='10px'>
              <PlaylistTitle title='Other Playlist>' navPlaylist={() => navPlaylist('other')} />
              <ScrollContainer>
                <Box display='flex' flexDirection='row'>
                  {songs
                    .filter(
                      (song) =>
                        (!song['private'] || song['uploaderId'] === userId) &&
                        song.genreTags.includes('other')
                    )
                    .map((song, i) => (
                      <Box key={`box-public-${song['title']}-${i}`}>
                        <SongCard
                          title={song['title']}
                          composer={song['composer']}
                          privacy={song['private']}
                          thumbnail={song['thumbnail']}
                          difficulty={song['difficulty']}
                          genreTags={song['genreTags']}
                          songId={song['id']}
                        />
                      </Box>
                    ))}
                </Box>
              </ScrollContainer>
            </Box>
          )}

          {/* Playlist Public */}
          <Box margin='10px'>
            <PlaylistTitle
              title='Playlist (Public) Test >'
              navPlaylist={() => navPlaylist('public')}
            />
            <ScrollContainer>
              <Box display='flex' flexDirection='row'>
                {songs
                  .filter((song) => !song['private'])
                  .map((song, i) => (
                    <Box key={`box-public-${song['title']}-${i}`}>
                      <SongCard
                        title={song['title']}
                        composer={song['composer']}
                        privacy={song['private']}
                        thumbnail={song['thumbnail']}
                        difficulty={song['difficulty']}
                        genreTags={song['genreTags']}
                        songId={song['id']}
                      />
                    </Box>
                  ))}
              </Box>
            </ScrollContainer>
          </Box>
        </>
      ) : (
        <SearchResults
          searchResults={searchResults}
          lastKey={lastKey}
          searchSongs={searchSongs}
          hasMoreResults={hasMoreResults}
        />
      )}
    </Box>
  );
};

export default Catalogue;
