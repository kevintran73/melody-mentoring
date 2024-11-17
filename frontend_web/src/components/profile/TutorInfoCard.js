import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import defaultImg from '../../assets/default-img.png';

const Img = styled('img')({
  width: '40px',
  objectFit: 'cover',
  borderRadius: '24px',
  marginLeft: '10px',
});

const StyledContainer = styled(Box)({
  border: '0.1px solid grey',
  padding: 1,
  height: '50px',
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '16px',
  gap: '5px',
});

const TutorInfoCard = ({ img, name }) => {
  return (
    <StyledContainer>
      <Box display='flex' alignItems='center'>
        <Box sx={{ marginRight: '10px' }}>
          <Img alt='tutor-card' src={img ? img : defaultImg} />
        </Box>

        <Box display='flex' justifyContent='center' alignItems='center'>
          <Typography fontSize='1rem'>{name}</Typography>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default TutorInfoCard;
