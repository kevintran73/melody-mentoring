import CachedIcon from '@mui/icons-material/Cached';
import { Box, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TokenContext from '../../context/TokenContext';

/**
 * Refresh selection and button component
 */

const StyledButton = styled(IconButton)({
  backgroundColor: '#020E37',
  color: 'white',
  margin: '10px 0px 0px 20px',
  '&:hover': {
    backgroundColor: 'blue',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
});

const TrackSummary = ({ sendSummaryFromChild }) => {
  const params = useParams();
  const [model, setModel] = useState('gemma-7b-it');
  const { accessToken } = React.useContext(TokenContext);

  const handleChange = (event) => {
    setModel(event.target.value);
  };

  const handleRefresh = () => {
    refreshSummary(model);
  };

  const sendInfoUp = (data) => {
    sendSummaryFromChild(data);
  };

  // Refresh summary text when button selected
  const refreshSummary = async (model) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/attempts/user/feedback-for-attempt/${params.trackAttemptId}?model=${model}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      sendInfoUp(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Fetch cancelled:', error.message);
      } else {
        console.error('Error fetching user details:', error);
      }
    }
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      sx={{ width: '250px', margin: '15px 15px 0px 0px', gap: '10px' }}
    >
      <Box display='flex' flexDirection='row'>
        <FormControl>
          <InputLabel id='model-select-label'>Model</InputLabel>
          <Select
            defaultValue={'gemma-7b-it'}
            labelId='model-select-label'
            id='model-select'
            value={model}
            label='Model'
            onChange={handleChange}
          >
            <MenuItem value={'gemma2-9b-it'}>Gemma2-9b</MenuItem>
            <MenuItem value={'gemma-7b-it'}>Gemma-7b</MenuItem>
            <MenuItem value={'llama3-groq-70b-8192-tool-use-preview'}>
              Llama-groq-70b
            </MenuItem>
            <MenuItem value={'llama-3.1-70b-versatile'}>Llama-3.1-70b</MenuItem>
            <MenuItem value={'llama-3.1-8b-instant'}>Llama-3.18b</MenuItem>
            <MenuItem value={'llama-3.2-1b-preview'}>Llama-3.2-1b</MenuItem>
            <MenuItem value={'llama-3.2-3b-preview'}>Llama-3.2-3b</MenuItem>
            <MenuItem value={'llama-3.2-11b-vision-preview'}>
              Llama-3.2-11b
            </MenuItem>
            <MenuItem value={'llama-3.2-90b-vision-preview'}>
              Llama-3.2-90b
            </MenuItem>
            <MenuItem value={'llama3-70b-8192'}>Llama3-70b</MenuItem>
            <MenuItem value={'llama3-8b-8192'}>Llama3-8b</MenuItem>
            <MenuItem value={'mixtral-8x7b-32768'}>Mixtral</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <StyledButton onClick={handleRefresh}>
            <CachedIcon />
          </StyledButton>
        </Box>
      </Box>
      <Typography variant='subtitle' fontSize='0.8rem' color='grey'>
        Changing models may take a moment
      </Typography>
    </Box>
  );
};

export default TrackSummary;
