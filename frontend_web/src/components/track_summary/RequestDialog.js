import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/system';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TokenContext from '../../context/TokenContext';
import { showErrorMessage } from '../../helpers';

const StyledButton = styled(Button)({
  width: '100%',
  backgroundColor: '#020E37',
  color: 'white',
  fontSize: '1rem',
  padding: '10px 16px',
  textTransform: 'none',
  borderRadius: '16px',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: 'blue',
  },
});

function SimpleDialog({ onClose, selectedValue, open, tutorRecs }) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  console.log(tutorRecs);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          width: '50vw',
        },
      }}
    >
      <DialogTitle>Select a Tutor</DialogTitle>
      <Divider sx={{ width: '100%' }} />
      <List sx={{ pt: 0 }}>
        {tutorRecs.map((tutor) => (
          <ListItem disableGutters key={tutor['tutorId']}>
            <ListItemButton onClick={() => handleListItemClick(tutor)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <img alt='tutor-card' src={tutor['profilePic']} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={tutor['tutorName']} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

const RequestDialog = () => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [tutors, setTutors] = useState([]);
  const { accessToken, userId } = React.useContext(TokenContext);
  const navigate = useNavigate();
  console.log(params.trackAttemptId);

  useEffect(() => {
    // Navigate to login if invalid token or user id
    if (accessToken === null || !userId) {
      return navigate('/login');
    }

    // Fetch tutorIds from profile
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
        fetchTutorDetails(response.data.tutors);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Fetch tutor details from tutorIds
    const fetchTutorDetails = async (tutorIds) => {
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
          const tutorPart = {
            tutorId: tutorId,
            tutorName: response.data.username,
            profilePic: response.data.profile_picture,
          };
          allTutorDetails.push(tutorPart);
        } catch (error) {
          console.error('Error fetching tutor details:', error);
        }
      }
      setTutors(allTutorDetails);
    };

    fetchProfile();
  }, [accessToken]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedTutor(value);
  };

  const handleDeny = (value) => {
    setSelectedTutor('');
  };

  const handleConfirm = async () => {
    try {
      const requestReview = {
        tutor: selectedTutor['tutorId'],
        trackAttemptId: params.trackAttemptId,
        studentId: userId,
      };
      const response = await axios.post(
        `http://localhost:5001/review/request`,
        { ...requestReview },
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

    setSelectedTutor('');
  };

  return (
    <Box>
      {/* Display tutor for review or display info */}
      {selectedTutor ? (
        <Typography variant='subtitle1' component='div'>
          Request {selectedTutor['tutorName']} for a review?
        </Typography>
      ) : (
        <Typography variant='subtitle1' component='div'>
          Click the button below to ask a tutor!
        </Typography>
      )}

      {/* Show confirm/deny buttons if tutor selected, 
        otherwise normal request button */}
      {selectedTutor ? (
        <Box display='flex' flexDirection='row' width='100%' gap='10px'>
          <StyledButton onClick={handleConfirm}>Confirm</StyledButton>
          <StyledButton onClick={handleDeny}>Deny</StyledButton>
        </Box>
      ) : (
        <StyledButton variant='outlined' onClick={handleClickOpen}>
          Request a Review
        </StyledButton>
      )}

      <SimpleDialog
        selectedValue={selectedTutor}
        open={open}
        onClose={handleClose}
        tutorRecs={tutors}
      />
    </Box>
  );
};

export default RequestDialog;
