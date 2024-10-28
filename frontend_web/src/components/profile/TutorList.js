import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TutorInfoCard from './TutorInfoCard';
import defaultImg from '../../assets/default-img.png';

const StyledCard = styled(Card)(() => ({
  width: '100%',
  height: '100%', 
  borderWidth: '2px',
  padding: '5px 10px',
  backgroundColor: 'blue',
}));

const TutorList = () => {
  return (
    <Box height='100%'>
      <StyledCard>
        <TutorInfoCard img={defaultImg} name='Tim' details='Testing details'/>
        <TutorInfoCard img={defaultImg} name='Jim' details='Testing other details'/>
      </StyledCard>
    </Box>
  );
}

export default TutorList;
