import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import defaultImg from '../../assets/default-img.png';
import TokenContext from '../../context/TokenContext';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(() => ({
  width: '100%',
  height: '100%', 
  borderWidth: '2px',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5%' ,
  borderRadius: '16px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
}));

const StyledButton = styled(Button)({
  width: '75%',
  backgroundColor: '#020E37',
  color:'white',
  fontSize: '1.3rem',
  padding: '8px 8px',
  textTransform: 'none',
  borderRadius: '16px',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: 'blue',
  },
});

const SongCard = () => {
  const [userData, setUserData] = useState(null);
  const token = useContext(TokenContext);

  useEffect(() => {
    console.log(token)
    console.log(token['userId'])
    const userId = token.userId;
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token['accessToken']}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <StyledCard variant='outlined'>
      <Box
        component="img"
        src={defaultImg}
        alt='test'
        sx={{
          width: '100%',
          objectFit: 'cover',
        }}
      />
      <Box padding='20px'>
        <Typography fontSize='2rem' component='div'>
          {userData ? userData['username'] : 'N/A'}
        </Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Date Joined: 10th September 2024</Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Instruments: {userData ? userData['instrument'] : 'N/A'}</Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Australian </Typography>
      </Box>
      <StyledButton> Change Profile </StyledButton>
    </StyledCard>
  );
};

export default SongCard;
