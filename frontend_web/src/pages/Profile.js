import React, { useEffect, useState } from 'react';
import NavBar from '../components/nav_bar/NavBar';
import Box from '@mui/material/Box';
import AchievementGrid from '../components/profile/AchievementGrid';
import { Typography } from '@mui/material';
import ProfileCard from '../components/profile/ProfileCard';
import TutorSearchCard from '../components/profile/TutorSearchCard';
import TutorList from '../components/profile/TutorList';
import StreakCard from '../components/profile/StreakCard';
import Card from '@mui/material/Card';
import { styled } from '@mui/system';
import axios from 'axios';
import TokenContext from '../context/TokenContext';
import AchievementCard from '../components/profile/AchievementCard';
import TutorsCard from '../components/profile/TutorsCard';
import { useNavigate, Navigate } from 'react-router-dom';

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
  gap: '2vw',

  '@media (max-width: 1000px)': {
    flexDirection: 'column',
    margin: '2vw 20vw',
  },
}));

/**
 * Profile page
 */
const Profile = () => {
  const navigate = useNavigate();

  const [profileInfo, setProfileInfo] = useState([]);
  const { accessToken, userId } = React.useContext(TokenContext);

  useEffect(() => {
    // Navigate to login if invalid token or user id
    if (accessToken === null || !userId) {
      return navigate('/login');
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setProfileInfo(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchProfile();
  }, [accessToken, userId, navigate]);

  return (
    <StyledContainer>
      <NavBar />
      <StyledCardsContainer>
        <Box flex={1}>
          <ProfileCard
            username={profileInfo['username']}
            profilePic={profileInfo['profile_picture']}
            email={profileInfo['email']}
            instrument={profileInfo['instrument']}
            level={profileInfo['level']}
            role={profileInfo['role']}
          />
        </Box>
        <Box flex={1}>
          <AchievementCard profileInfo={profileInfo} />
        </Box>
        <Box flex={1}>
          <TutorsCard profileInfo={profileInfo} />
        </Box>
      </StyledCardsContainer>
    </StyledContainer>
  );
};

export default Profile;
