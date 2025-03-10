import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import defaultImg from '../../assets/default-img.png';

import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(() => ({
  width: '150px',
  height: '240px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '12px',
  paddingBottom: '5px',
  margin: '10px',
  marginRight: '15px',
  cursor: 'pointer',
}));

const SongThumbnail = ({ ...props }) => <StyledSongThumbnail {...props} />;

const StyledSongThumbnail = styled('div')`
  height: 124px;
  width: 124px;
  object-fit: cover;
  background-color: #f2f2f2;
  background-image: ${(props) =>
    props.thumbnail === '' ? `url(${defaultImg})` : `url(${props.thumbnail})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex: 0 0 auto;
  border-radius: 20px;
  margin-top: 0.25rem;
`;

const SongCard = ({ title, thumbnail, composer, difficulty, songId }) => {
  const navigate = useNavigate();

  const navExperiment = () => {
    return navigate(`/pre-experiment/${songId}`);
  };

  return (
    <StyledCard
      variant='outlined'
      onClick={navExperiment}
      data-cy={`song-card-${title}`}
    >
      <SongThumbnail thumbnail={thumbnail ? thumbnail : defaultImg} alt='img' />
      <Box padding='2px' textAlign='center'>
        <Typography fontSize='1rem' component='div'>
          {title}
        </Typography>
        <Typography fontSize='0.9rem' sx={{ color: 'text.secondary' }}>
          {composer ? composer : 'Unknown'}
        </Typography>
        <Typography fontSize='0.8rem' sx={{ color: 'text.secondary' }}>
          Difficulty: {difficulty}
        </Typography>
      </Box>
    </StyledCard>
  );
};

export default SongCard;
