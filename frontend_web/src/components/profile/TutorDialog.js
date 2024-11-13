import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import Box from '@mui/material/Box';
import TokenContext from '../../context/TokenContext';
import axios from 'axios';
import { showErrorMessage } from '../../helpers';

import { styled } from '@mui/system';

const exampleTutorNames = ['Jim Adams1', 'John Cassyworth1', 'Amy Chi1', 'Lucas Lars1', 'Jim Adams', 'John Cassyworth', 'Amy Chi', 'Lucas Lars', 'Jim Adams2', 'John Cassyworth2', 'Amy Chi2', 'Lucas Lars2'];

const StyledButton = styled(Button)({
  width: '100%',
  backgroundColor: '#020E37',
  color:'white',
  fontSize: '1rem',
  padding: '10px 16px',
  textTransform: 'none',
  borderRadius: '16px',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: 'blue',
  },
});


function SimpleDialog({onClose, selectedValue, open, tutorRecs}) {
  // const { onClose, selectedValue, open, tutorRecs } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth={'30vw'}
    >
      <DialogTitle>Select a Tutor</DialogTitle>
      <List sx={{ pt: 0 }}>
        {tutorRecs.map((tutor) => (
          <ListItem disableGutters key={tutor}>
            <ListItemButton onClick={() => handleListItemClick(tutor)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={tutor} />
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

const TutorDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [tutorRecs, setTutorRecs] = useState([]);
  const { accessToken, userId } = React.useContext(TokenContext);

  useEffect(() => {
    const fetchTutorRecs = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/tutor-recommendations/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        fetchTutorNames(response.data.tutors)
      } catch (error) {
        console.error('Error fetching tutor recommendation details:', error);
      }
    };

    const fetchTutorNames = async (tutorIds) => {
      const allTutorNames = [];

      for (const tutorId of tutorIds) {
        try {
          const response = await axios.get(`http://localhost:5001/profile/${tutorId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          allTutorNames.push(response.data.username);
        } catch (error) {
          console.error('Error fetching tutor details:', error);
        }
      }
      setTutorRecs(allTutorNames);
      console.log(allTutorNames)
    };

    fetchTutorRecs();
  }, [accessToken]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedTutor(value);
    console.log(value)
  };

  const handleDeny = (value) => {
    setSelectedTutor('');
  };

  const handleConfirm = async () => {
    try {
      const requestTutorInfo = {
        studentId: userId,
        tutorId: selectedTutor,
      };

      console.log(selectedTutor)
      console.log(requestTutorInfo);

      const response = await axios.post(
        `http://localhost:5001/tutor/request/${userId}/${selectedTutor}`,
        { ...requestTutorInfo },
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
      {selectedTutor ? (
        <Typography variant="subtitle1" component="div">
          Request {selectedTutor} as a tutor?
        </Typography>
      ) : (
        <Typography variant="subtitle1" component="div">
          Click the button below to find one!
        </Typography>
      )
      }
      {selectedTutor ? (
        <Box display='flex' flexDirection='row' width='100%' gap='10px'>
          <StyledButton onClick={handleConfirm}>Confirm</StyledButton>
          <StyledButton onClick={handleDeny}>Deny</StyledButton>
        </Box>
      ) : (
        <StyledButton variant="outlined" onClick={handleClickOpen}>
          Find a Tutor
        </StyledButton>
      )}

      <SimpleDialog
        selectedValue={selectedTutor}
        open={open}
        onClose={handleClose}
        tutorRecs={tutorRecs}
      />
    </Box>
  );
}

export default TutorDialog;
