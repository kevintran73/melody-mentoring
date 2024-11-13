import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import defaultImg from '../../assets/default-img.png';
import { useNavigate, useLocation } from 'react-router-dom';

const Img = styled('img')({
  margin: '5px',
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
});

const StyledContainer = styled(Box)({
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  padding: 1,
  maxHeight: '125px',
  width: '90%',
  flexGrow: 1,
  margin: '10px 0',
  cursor: 'pointer',
  backgroundColor: 'white',
  borderRadius: '16px',
});

const HistoryCard = ({ title, composer, difficulty, date, thumbnail, trackAttemptId }) => {
  const navigate = useNavigate();

  const navTrackSummary = () => {
    return navigate(`/track-summary/${trackAttemptId}`);
  };

  return (
    <StyledContainer onClick={navTrackSummary}>
      <Box display='flex'>
        <Box sx={{ marginRight: '10px' }}>
          <Img alt='playlist-card' src={thumbnail ? thumbnail : defaultImg}/>
        </Box>

        <Box>
          <Typography fontSize='1.8rem' component='div'>
            {title}
          </Typography>
          <Typography fontSize='1.2rem'>
            {composer} • Difficulty: {difficulty}
          </Typography>
          <Typography fontSize='1.2rem' marginTop='1%'>
            {date}
          </Typography>
        </Box>

      </Box>
    </StyledContainer>
  );
}

export default HistoryCard;
