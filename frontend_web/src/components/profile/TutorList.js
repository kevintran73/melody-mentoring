import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TutorInfoCard from './TutorInfoCard';
import defaultImg from '../../assets/default-img.png';
import TokenContext from '../../context/TokenContext';

const StyledCard = styled(Card)(() => ({
  width: '100%',
  height: '100%',
  borderWidth: '2px',
  padding: '10px 10px',
  gap: '7px',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
  borderRadius: '16px',
}));

const TutorList = ({ tutorIds }) => {
  const [tutorsInfo, setTutorsInfo] = useState([]);
  const { accessToken } = useContext(TokenContext);

  useEffect(() => {
    if (!tutorIds || tutorIds.length === 0) return;

    const fetchTutorDetails = async () => {
      const allTutorDetails = [];

      for (const tutorId of tutorIds) {
        try {
          const response = await axios.get(
            `http://localhost:5001/profile/${tutorId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          allTutorDetails.push(response.data);
        } catch (error) {
          console.error('Error fetching tutor details:', error);
        }
      }
      setTutorsInfo(allTutorDetails);
    };

    fetchTutorDetails();
  }, [tutorIds, accessToken]);

  return (
    <Box height='100%'>
      <StyledCard>
        {tutorsInfo.map((tutorInfo, i) => (
          <TutorInfoCard
            key={i}
            name={tutorInfo['username']}
            img={tutorInfo['profile_picture']}
            details={'test'}
          />
        ))}
      </StyledCard>
    </Box>
  );
};

export default TutorList;
