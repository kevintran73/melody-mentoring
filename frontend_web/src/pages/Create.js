import React from 'react';

import defaultImage from '../assets/default-img.png';
import NavBar from '../components/nav_bar/NavBar';
import InputFileUpload from '../components/utilities/InputFileUpload';

import { styled } from '@mui/material';
import { Button, TextField, FormControl, InputLabel } from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const StyledHeader = styled('h1')({
  fontSize: '2rem',
  marginBottom: '0.5rem',
});

const PageBlock = styled('div')({
  height: 'calc(100vh - 70px - 4rem)',
  margin: '1rem 2.5rem',
});

const UploadForm = styled('form')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  gap: '30px',
  height: 'calc(90vh - 70px - 4rem)',
  marginTop: '2rem',
  padding: '2rem 2rem',
  border: '1px solid gray',
  borderRadius: '10px',
  width: '100%',
});

const ImgContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px',
  width: '35%',
  height: '100%',
});

const ImgRight = styled('img')({
  width: '70%',
  objectFit: 'cover',
  borderRadius: '10%',
});

const TextFieldsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
  width: '58%',
});

const SubmitButton = styled(Button)({
  backgroundColor: '#2C2C2C',
  color: '#ffffff',
  width: '100%',
  height: '3rem',
  fontSize: '1.1rem',

  '&:hover': {
    backgroundColor: '#3D3D3D',
  },
});

/**
 * Create experiment page
 */
const Create = () => {
  const [diff, setDiff] = React.useState('');

  const handleChange = (event) => {
    setDiff(event.target.value);
  };

  return (
    <>
      <NavBar></NavBar>
      <PageBlock>
        <StyledHeader>Create an experiment</StyledHeader>
        <UploadForm noValidate>
          <ImgContainer>
            <ImgRight src={defaultImage} />
            <InputFileUpload innerText='Upload a song' width='60%' fontSize='1.3rem' />
          </ImgContainer>

          <TextFieldsContainer>
            <TextField label='Song Name' />
            <TextField label='Artist' />
            <FormControl fullWidth>
              <InputLabel id='select-difficulty-label'>Difficulty</InputLabel>
              <Select
                labelId='select-difficulty-label'
                id='select-difficulty'
                value={diff}
                label='Difficulty'
                onChange={handleChange}
              >
                <MenuItem value='easy'>Easy</MenuItem>
                <MenuItem value='medium'>Medium</MenuItem>
                <MenuItem value='hard'>Hard</MenuItem>
                <MenuItem value='expert'>Expert</MenuItem>
              </Select>
            </FormControl>
            <TextField label='Description' />
            <SubmitButton>Submit</SubmitButton>
          </TextFieldsContainer>
        </UploadForm>
      </PageBlock>
    </>
  );
};

export default Create;
