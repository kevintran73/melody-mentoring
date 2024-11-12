import React, { useEffect, useState } from 'react';
import NavBar from '../components/nav_bar/NavBar';
import Box from '@mui/material/Box';
import AchievementGrid from '../components/profile/AchievementGrid';
import { Typography } from '@mui/material';
import ProfileCard from '../components/profile/ProfileCard';
import TutorSearchCard from '../components/profile/TutorSearchCard';
import TutorList from '../components/profile/TutorList';
import Card from '@mui/material/Card';
import { styled } from '@mui/system';
import axios from 'axios';
import TokenContext from '../context/TokenContext';

const StyledContainer = styled(Box)(() => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#E3E3E3',
}));

const StyledCardsContainer = styled(Box)(() => ({
  flex: '1',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'center',
  margin: '2vw 1vw',
  padding: '10px',
  gap:'2vw',
}));

/**
 * Profile page
 */
const Profile = () => {
  const [profileInfo, setProfileInfo] = useState([]);
  const { accessToken, userId } = React.useContext(TokenContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProfileInfo(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // const fetchTutorRecommendations = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:5001/tutor-recommendations/${userId}`, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     });
    //     setProfileInfo(response.data);
    //     console.log(response.data)
    //   } catch (error) {
    //     console.error('Error fetching tutor recommendation details:', error);
    //   }
    // };

    fetchProfile();
    // fetchTutorRecommendations();
  }, [accessToken]);

  return (
    <StyledContainer>
      <NavBar />
      <StyledCardsContainer>
        {/* Profile Card */}
        <Box flex={1}>
          <ProfileCard 
            username={profileInfo['username']}
            profilePic={profileInfo['profile_picture']}
            email={profileInfo['email']}
            instrument={profileInfo['instrument']}
            level={profileInfo['level']}
          />
        </Box>

        {/* Achievements */}
        <Box flex={1} flexDirection='column' alignItems='center' justifyContent='center' textAlign='center'>
          <Card sx={{ borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <Typography variant='h3'> Achievements </Typography>
            <AchievementGrid></AchievementGrid>
          </Card>
        </Box>

        {/* Tutors */}
        <Box flex={1} flexDirection='column' alignItems='center' justifyContent='center' height='100%' flexGrow={1}>
          <Card sx={{ borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column', padding: '20px', gap: '10px'}}>
            <Typography variant='h3' textAlign='center'>Tutors</Typography>
            <Box flex='6' width='100%' justifyContent='center' padding='10px' borderRadius='16px'>
              <TutorList />
            </Box>
            <Box display='flex' flex='1' width='100%' alignItems='center' justifyContent='center'>
              <TutorSearchCard />
            </Box>
          </Card>
        </Box>
      </StyledCardsContainer>
    </StyledContainer>
  );
};

export default Profile;
