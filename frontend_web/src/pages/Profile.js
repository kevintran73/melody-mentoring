import React from 'react';
import NavBar from '../components/nav_bar/NavBar';
import Box from '@mui/material/Box';
import AchievementGrid from '../components/profile/AchievementGrid';
import { Typography } from '@mui/material';
import ProfileCard from '../components/profile/ProfileCard';
import TutorSearchCard from '../components/profile/TutorSearchCard';
import TutorList from '../components/profile/TutorList';

/**
 * Profile page
 */
const Profile = () => {
  return (
    <Box height='100vh' display='flex' flexDirection='column' backgroundColor='#f5f5f5'>
      <NavBar />

      <Box flex='1' backgroundColor='green' display='flex' flexDirection='row' alignItems='center' justifyContent='center' margin='30px'>
        {/* Profile Card */}
        <Box flex='3' backgroundColor='blue' width='100%' height='100%' padding='0'>
          <ProfileCard></ProfileCard>
        </Box>

        {/* Achievements */}
        <Box flex='3' backgroundColor='purple' display='flex' flexDirection='column' height='100%' padding='20px 0px' alignItems='center' justifyContent='center'>
          <Typography variant='h3'> Achievements </Typography>
          <AchievementGrid></AchievementGrid>
        </Box>

        {/* Tutors */}
        <Box flex='2' backgroundColor='red' height='100%' padding='20px 0px' display='flex' flexDirection='column' alignItems='center'>
          <Typography variant='h3' marginBottom='15px'>Tutors</Typography>
          <Box flex='6' width='100%' backgroundColor='orange' justifyContent='center' padding='10px'>
            <TutorList />
          </Box>
          <Box display='flex' flex='1' width='100%' alignItems='center' justifyContent='center'>
            <TutorSearchCard />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Profile;
