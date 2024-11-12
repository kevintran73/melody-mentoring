import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TutorInfoCard from './TutorInfoCard';
import defaultImg from '../../assets/default-img.png';

const StyledCard = styled(Card)(() => ({
  width: '100%',
  height: '40vh', 
  borderWidth: '2px',
  padding: '10px 10px',
  gap: '7px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'scroll',
  borderRadius: '16px',
}));

const TutorList = () => {
  return (
    <Box height='100%' sx={{ overflow: 'scroll' }}>
      <StyledCard>
        <TutorInfoCard img={defaultImg} name='Tim' details='Tutor details'/>
        <TutorInfoCard img={defaultImg} name='Jim' details='Jims other details'/>
        <TutorInfoCard img={defaultImg} name='Tim' details='Tutor details'/>
        <TutorInfoCard img={defaultImg} name='Jim' details='Jims other details'/>
        <TutorInfoCard img={defaultImg} name='Tim' details='Tutor details'/>
        <TutorInfoCard img={defaultImg} name='Jim' details='Jims other details'/>
        <TutorInfoCard img={defaultImg} name='Tim' details='Tutor details'/>
        <TutorInfoCard img={defaultImg} name='Jim' details='Jims other details'/>
      </StyledCard>
    </Box>
  );
}

export default TutorList;
