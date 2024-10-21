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

const UploadBlock = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: '30px',
  height: 'calc(90vh - 70px - 4rem)',
  marginTop: '2rem',
  padding: '2rem 2rem',
  border: '1px solid gray',
  borderRadius: '10px',
});

const ImgContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
});

const ImgRight = styled('img')({
  width: '300px',
  height: '300px',
  borderRadius: '10%',
});

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'row',
  gap: '30px',
});

const TextFieldsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
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
        <UploadBlock>
          <StyledForm noValidate>
            <ImgContainer>
              <ImgRight src={defaultImage} />
              <InputFileUpload innerText='Upload a song' />
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
            </TextFieldsContainer>
          </StyledForm>
        </UploadBlock>
      </PageBlock>
    </>
  );
};

export default Create;
