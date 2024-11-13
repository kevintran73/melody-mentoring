import React from 'react';

import SongCard from './SongCard';

import { debounce, styled } from '@mui/material';
import Box from '@mui/material/Box';

const SongsContainer = styled('div')({
  padding: '100px 20px',
  width: 'calc(100vw - 40px)',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '16px',
  paddingBottom: '50vh',
  backgroundColor: '#f9f9f9',
});

const SearchResults = ({ searchResults, lastKey, searchSongs, hasMoreResults }) => {
  // Set up scroll event listener
  React.useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        searchSongs();
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchSongs]);

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
