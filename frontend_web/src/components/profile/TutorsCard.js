import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import TutorSearchCard from './TutorSearchCard';
import TutorList from './TutorList';
import Card from '@mui/material/Card';

/**
 * Profile page
 */
const TutorsCard = ({ profileInfo}) => {
  return (
    <Box
      flex={1}
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      height='100%'
      flexGrow={1}
    >
      <Card
        sx={{
          borderRadius: '16px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          gap: '10px',
        }}
      >
        <Typography variant='h3' textAlign='center'>
          Tutors
        </Typography>
        <Box
          flex='6'
          width='100%'
          justifyContent='center'
          padding='10px'
          borderRadius='16px'
        >
          <TutorList tutorIds={profileInfo['tutors']} />
        </Box>
        <Box
          display='flex'
          flex='1'
          width='100%'
          alignItems='center'
          justifyContent='center'
        >
          <TutorSearchCard />
        </Box>
      </Card>
    </Box>
  );
};

export default TutorsCard;
