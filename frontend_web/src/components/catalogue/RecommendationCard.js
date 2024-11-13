import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import defaultImg from '../../assets/default-img.png';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '12px',
  margin: '10px',
  cursor: 'pointer',
}));

const StyledHeader5 = styled('h5')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  margin: '5px 10px',
  fontSize: '1.25rem',
});

const SongThumbnail = ({ ...props }) => <ResponseSongThumbnail {...props} />;

const StyledSongThumbnail = styled('div')`
  height: 200px;
  width: 200px;
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

const ResponseSongThumbnail = styled(StyledSongThumbnail)({
  '@media (min-width: 1001px)': {
    width: '250px',
    height: '250px',
  },
});

const RecommendationCard = ({ songId, title, thumbnail }) => {
  const navigate = useNavigate();

  const navExperiment = () => {
    return navigate(`/pre-experiment/${songId}`);
  };

  return (
    <StyledCard variant='outlined' onClick={navExperiment}>
      <Box position='relative'>
        <SongThumbnail thumbnail={thumbnail ? thumbnail : ''} alt='img' />
        <Box
          position='absolute'
          top={0}
          left={0}
          right={0}
          bottom={0}
          display='flex'
          alignItems='flex-end'
          color='white'
          fontSize='1rem'
          bgcolor='rgba(0, 0, 0, 0.3)'
        >
          <StyledHeader5>{title}</StyledHeader5>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default RecommendationCard;
