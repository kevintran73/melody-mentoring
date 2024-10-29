import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '70%',
  // minWidth: '150px',
  height: '100%', 
  // minHeight: '220px',
  borderWidth: '2px',
  // boxShadow: '5px 10px grey',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  padding: '2vw',
  borderRadius: '16px',
}));

const StyledButton = styled(Button)({
  width: '90%',
  backgroundColor: '#020E37',
  color:'white',
  fontSize: '1rem',
  padding: '10px 16px',
  textTransform: 'none',
  borderRadius: '16px',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: 'blue',
    // borderColor: '#0062cc',
    // boxShadow: 'none',
  },
});

const TutorSearchCard = () => {
  // const navigate = useNavigate();

  // const navSettings = () => {
  //   return navigate('/settings');
  // };

  return (
    <StyledCard variant='outlined'>
      <Box>
        <Typography fontSize='1.5rem' component='div'>Want to add more tutors?</Typography>
        {/* <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Test</Typography> */}
      </Box>
      <StyledButton> Find a Tutor </StyledButton>
    </StyledCard>
  );
};

export default TutorSearchCard;
