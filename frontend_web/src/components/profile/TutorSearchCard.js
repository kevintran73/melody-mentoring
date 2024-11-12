import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TutorDialog from './TutorDialog';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '90%',
  // minWidth: '150px',
  height: '100%', 
  // minHeight: '220px',
  borderWidth: '2px',
  // boxShadow: '5px 10px grey',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  padding: '2vw',
  borderRadius: '16px',
}));

const TutorSearchCard = () => {
  return (
    <StyledCard variant='outlined'>
      <Box>
        <Typography fontSize='1.5rem' component='div'>Want to add more tutors?</Typography>
      </Box>
      <TutorDialog />
    </StyledCard>
  );
};

export default TutorSearchCard;
