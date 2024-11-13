import React from 'react';

import SongCard from './SongCard';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

const SongsContainer = styled('div')({
  padding: '50px 10px',
  width: 'calc(100vw - 40px)',
  height: 'auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '16px',
});

const SearchResults = ({ searchResults, lastKey, searchSongs }) => {
  // Set up scroll event listener
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        searchSongs();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchSongs]);

  // Initial fetch on component mount
  //   React.useEffect(() => {
  //     searchSongs();
  //   }, [searchSongs]);

  return (
    <SongsContainer>
      {searchResults.map((song, i) => (
        <Box key={`box-search-${song['title']}-${i}`}>
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
    </SongsContainer>
  );
};

export default SearchResults;
