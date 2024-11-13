import * as React from 'react';
import { styled } from '@mui/system';
import axios from 'axios';
import {
  showErrorMessage,
  showSuccessMessage,
  showUploadingMessage,
  uploadFileToS3,
} from '../../helpers';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import InputFileUpload from '../utilities/InputFileUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '15px',
};

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
});

const StyledButton = styled(Button)({
  width: '250px',
  color: 'white',
  fontSize: '1.1rem',
  backgroundColor: '#1b998b',

  '&:hover': {
    backgroundColor: '#1b998b',
  },
});

// Modal to upload a recording directly
const UploadRecordingModal = ({ navigate, userId, songId, accessToken }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [songRecording, setSongRecording] = React.useState(null);
  const uploadRecording = async (event) => {
    event.preventDefault();

    // Validate .wav file type
    if (!(songRecording && songRecording.type === 'audio/wav')) {
      showErrorMessage('Song recording file type must be a .wav');
      return;
    }

    showUploadingMessage('Uploading recording...');
    // Upload to S3
    try {
      const response = await axios.post(
        'http://localhost:5001/files/user/new-track-attempt',
        { userId: userId, songId: songId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      await uploadFileToS3(response.data.audioUploader, songRecording);
      showSuccessMessage('Success! Your recording was successfully uploaded.');

      return navigate('/history');
    } catch (err) {
      showErrorMessage(err.response.data.error);
    }

    setSongRecording(null);
    setOpen(false);
  };

  return (
    <div>
      <StyledButton onClick={handleOpen} id='upload-recording-modal-button'>
        Upload a recording
      </StyledButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='upload-recording-modal-title'
        aria-describedby='upload-recording-modal-description'
      >
        <Box sx={style}>
          <StyledForm>
            <Typography id='upload-recording-title' variant='h6' component='h2'>
              Upload a song recording
            </Typography>
            <InputFileUpload
              innerText='Add a recording'
              id='upload-recording-button'
              width='100%'
              fontSize='0.9rem'
              accept='audio/wav'
              backgroundColor='#1b998b'
              hoverColor='#1fad9e'
              onChangeEvent={(p) => setSongRecording(p.target.files[0])}
            />
            <Button
              type='submit'
              onClick={uploadRecording}
              variant='contained'
              id='upload-recording-go'
            >
              Upload
            </Button>
          </StyledForm>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadRecordingModal;
