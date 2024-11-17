import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import defaultImg from '../../assets/default-img.png';
import TokenContext from '../../context/TokenContext';
import { getBase64, showErrorMessage } from '../../helpers';

const StyledCard = styled(Card)(() => ({
  width: '100%',
  height: '100%',
  borderWidth: '2px',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5%',
  borderRadius: '16px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',

  '@media (max-width: 1000px)': {
    flexDirection: 'row',
    gap: '20px',
  },
}));

const StyledButton = styled(Button)({
  width: '75%',
  backgroundColor: '#020E37',
  color: 'white',
  fontSize: '1.3rem',
  padding: '8px 20px',
  textTransform: 'none',
  borderRadius: '16px',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: 'blue',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '@media (max-width: 1000px)': {
    fontSize: '2.5vw',
  },
});

const LoadingOverlayMain = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 1000,
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ProfileText = ({ username, email, instrument, level, role }) => {
  if (!username || !email || !instrument || !level || !role) {
    return null;
  }

  return (
    <Box padding='20px'>
      <Typography
        component='div'
        sx={{
          margin: '0px 0px 10px 0px',
          fontSize: '3vw',
          '@media (max-width: 1000px)': {
            fontSize: '4vw',
          },
        }}
      >
        {username}
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: '1.4rem',
          '@media (max-width: 1000px)': {
            fontSize: '3vw',
          },
        }}
      >
        Email: {email}
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: '1.4rem',
          '@media (max-width: 1000px)': {
            fontSize: '3vw',
          },
        }}
      >
        Instrument: {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: '1.4rem',
          '@media (max-width: 1000px)': {
            fontSize: '3vw',
          },
        }}
      >
        Level: {level}
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: '1.4rem',
          '@media (max-width: 1000px)': {
            fontSize: '3vw',
          },
        }}
      >
        Role: {role.charAt(0).toUpperCase() + role.slice(1)}
      </Typography>
    </Box>
  );
};

const SongCard = ({ username, profilePic, email, instrument, level, role }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [profileImage, setProfileImage] = useState(profilePic);
  const { accessToken, userId } = React.useContext(TokenContext);

  let allowedImageFiles = ['image/jpeg', 'image/jpg', 'image/png'];

  useEffect(() => {
    setProfileImage(profilePic);
  }, [profilePic]);

  // Update potential profile pic on selection and changes to confirm/deny buttons
  const handleChange = async (event) => {
    const file = event.target.files[0];
    const profilePic64 = await getBase64(file);
    setUploadedImage(profilePic64);
    setUploadedFile(file);
    setIsConfirming(true);
  };

  // Deny upload
  const handleDeny = () => {
    setUploadedFile('');
    setUploadedImage('');
    setIsConfirming(false);
  };

  // Upload image when confirmed
  const handleConfirm = async (event) => {
    event.preventDefault();

    if (uploadedFile !== '' && !allowedImageFiles.includes(uploadedFile.type)) {
      showErrorMessage(
        'Thumbnail is an unsupported file type (accepted: .jpeg, .jpg, .png)'
      );
      return;
    }

    try {
      const profilePicInfo = {
        userId: userId,
        picture: uploadedImage,
      };

      setProfileImage(uploadedImage);

      const response = await axios.put(
        'http://localhost:5001/profile/profile-picture',
        { ...profilePicInfo },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err) {
      showErrorMessage(err.response.data.error);
      return;
    }

    setUploadedFile('');
    setUploadedImage('');
    setIsConfirming(false);
  };

  return (
    <StyledCard variant='outlined'>
      {/* If waiting on profile pic confirmation, show the picture */}
      {profileImage ? (
        isConfirming ? (
          <Box
            component='img'
            src={uploadedImage ? uploadedImage : defaultImg}
            sx={{
              width: '70%',
              borderRadius: '30px',
              '@media (max-width: 1000px)': {
                width: '40%',
              },
            }}
          />
        ) : (
          <Box
            component='img'
            src={profileImage ? profileImage : defaultImg}
            sx={{
              width: '70%',
              borderRadius: '30px',
              '@media (max-width: 1000px)': {
                width: '40%',
              },
            }}
          />
        )
      ) : (
        <LoadingOverlayMain>
          <CircularProgress size='20vh' />
        </LoadingOverlayMain>
      )}
      <Box>
        <ProfileText
          username={username}
          email={email}
          instrument={instrument}
          level={level}
          role={role}
        ></ProfileText>

        {/* If waiting on profile pic confirmation show confirm and deny buttons */}
        {isConfirming ? (
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='center'
            alignItems='center'
            width='100%'
            gap='20px'
          >
            <StyledButton onClick={handleConfirm}>Confirm</StyledButton>
            <StyledButton onClick={handleDeny}>Deny</StyledButton>
          </Box>
        ) : (
          <StyledButton
            component='label'
            // role={undefined}
            variant='contained'
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload Profile Picture
            <VisuallyHiddenInput type='file' onChange={handleChange} multiple />
          </StyledButton>
        )}
      </Box>
    </StyledCard>
  );
};

export default SongCard;
