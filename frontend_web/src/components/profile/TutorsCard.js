import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { styled } from '@mui/system';
import React from 'react';
import TutorList from './TutorList';
import TutorSearchCard from './TutorSearchCard';

const StyledCard = styled(Card)(() => ({
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'space-between',
  justifyContent: 'space-between',
  height: '100%',
  borderRadius: '16px',
  padding: '10px',
}));

/**
 * Tutors card component
 */
const TutorsCard = ({ profileInfo }) => {
  return (
    <StyledCard>
      <Typography fontSize='3.6vw' textAlign='center'>
        Tutors
      </Typography>

      {/* List of all tutors assigned to student */}
      <Box
        flex='6'
        width='100%'
        justifyContent='center'
        padding='10px'
        borderRadius='16px'
      >
        <TutorList tutorIds={profileInfo['tutors']} />
      </Box>

      {/* Card for adding more tutors */}
      <Box
        display='flex'
        flex='1'
        width='100%'
        alignItems='center'
        justifyContent='center'
      >
        <TutorSearchCard />
      </Box>
    </StyledCard>
  );
};

export default TutorsCard;
