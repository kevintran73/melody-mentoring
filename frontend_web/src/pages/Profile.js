import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/nav_bar/NavBar';
import AchievementCard from '../components/profile/AchievementCard';
import ProfileCard from '../components/profile/ProfileCard';
import TutorsCard from '../components/profile/TutorsCard';
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
  gap: '2vw',

  '@media (max-width: 1000px)': {
    flexDirection: 'column',
    margin: '2vw 10vw',
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
        {profileInfo['role'] === 'student' ? (
          <>
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
          </>
        ) : (
          <>
            <Box flex={1} />
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
            <Box flex={1} />
          </>
        )}
      </StyledCardsContainer>
    </StyledContainer>
  );
};

export default Profile;
