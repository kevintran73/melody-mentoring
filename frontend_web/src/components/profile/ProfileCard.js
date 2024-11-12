import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import defaultImg from '../../assets/default-img.png';
import TokenContext from '../../context/TokenContext';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getBase64, mapCommaStringToArray, showErrorMessage, uploadFileToS3 } from '../../helpers';

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
    backgroundColor: '#020E37',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
});

const LoadingOverlayMain = styled(Box)({
  // position: 'fixed',
  // top: 0,
  // left: 0,
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

const SongCard = ({ username, profilePic, email, instrument, level, onChange }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [profileImage, setProfileImage] = useState(profilePic);
  const { accessToken, userId } = React.useContext(TokenContext);

  let allowedImageFiles = ['image/jpeg', 'image/jpg', 'image/png'];

  useEffect(() => {
    setProfileImage(profilePic);
  }, [profilePic]);

  const handleChange = async (event) => {
    const file = event.target.files[0];
    const profilePic64 = await getBase64(file)
    setUploadedImage(profilePic64)
    setUploadedFile(file);
    setIsConfirming(true);
  };

  const handleDeny = () => {
    setUploadedFile('');
    setUploadedImage('');
    setIsConfirming(false);
  };

  const handleConfirm = async (event) => {
    event.preventDefault();

    if (uploadedFile !== '' && !allowedImageFiles.includes(uploadedFile.type)) {
      showErrorMessage('Thumbnail is an unsupported file type (accepted: .jpeg, .jpg, .png)');
      return;
    }

    try {
      const profilePicInfo = {
        userId: userId,
        picture: uploadedImage,
      };

      console.log(profilePicInfo)
      console.log(uploadedImage);

      setProfileImage(uploadedImage)

      const response = await axios.post(
        'http://localhost:5001/files/profile/profile-picture',
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
  }

  return (
    <StyledCard variant='outlined'>
    {profileImage ? (
      isConfirming ? (
        <Box
          component="img"
          src={uploadedImage ? uploadedImage : defaultImg}
          sx={{
            width: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Box
          component="img"
          src={profileImage ? profileImage : defaultImg}
          sx={{
            width: '100%',
            objectFit: 'cover',
          }}
        />
      )
    ) : (
      <LoadingOverlayMain>
        <CircularProgress size='20vh' />
      </LoadingOverlayMain>
    )}
      <Box padding='20px'>
        <Typography fontSize='2rem' component='div'>
          {username}
        </Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Email: {email}</Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Instrument: {instrument}</Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Level: {level}</Typography>
        <Typography fontSize='1.2rem' sx={{ color: 'text.secondary' }}>Role: Student</Typography>
      </Box>
      {isConfirming ? (
        <Box display='flex' flexDirection='row' width='80%' gap='10px'>
          <StyledButton onClick={handleConfirm}>Confirm</StyledButton>
          <StyledButton onClick={handleDeny}>Deny</StyledButton>
        </Box>
      ) : (
        <StyledButton
          component="label"
          // role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={handleChange}
            multiple
          />
        </StyledButton>
      )}
    </StyledCard>
  );
};

export default SongCard;
