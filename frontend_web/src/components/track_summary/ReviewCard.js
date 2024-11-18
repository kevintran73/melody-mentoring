import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import React from 'react';
import Divider from '@mui/material/Divider';

const StyledCard = styled(Card)(() => ({
  borderWidth: '2px',
  padding: '12px',
  paddingBottom: '5px',
  height: '100%',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  alignContent: 'space-evenly',
  textAlign: 'center',
  width: '100%',
}));

const ReviewCard = ({ tutor, feedback }) => {
  return (
    <StyledCard variant='outlined'>
      <Box
        padding='5px'
        display='flex'
        flexDirection='column'
        alignItems='center'
        width='100%'
        height='100%'
      >
        <Typography
          fontSize='1.4rem'
          component='div'
          width='95%'
          sx={{
            wordWrap: 'break-word',
          }}
        >
          {tutor}
        </Typography>
        <Divider sx={{ width: '100%', my: 2 }} />
        <Typography
          fontSize='1rem'
          component='div'
          width='95%'
          height='100%'
          sx={{
            wordWrap: 'break-word',
            overflowY: 'auto',
          }}
        >
          {feedback}
        </Typography>
      </Box>
    </StyledCard>
  );
};

export default ReviewCard;
