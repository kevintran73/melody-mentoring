import React from 'react';
import axios from 'axios';
import { getBase64, mapCommaStringToArray, showErrorMessage, uploadFileToS3 } from '../helpers';

import defaultImage from '../assets/default-img.png';
import NavBar from '../components/nav_bar/NavBar';
import InputFileUpload from '../components/utilities/InputFileUpload';

import { styled } from '@mui/material';
import { Button, TextField, FormControl, InputLabel } from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TokenContext from '../context/TokenContext';
import { Navigate } from 'react-router-dom';

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
  const [thumbnail, setThumbnail] = React.useState(defaultImage);
  const [song, setSong] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [diff, setDiff] = React.useState('');
  const [genreTags, setGenreTags] = React.useState('');
  const [instrument, setInstrument] = React.useState('');
  const [songFile, setSongFile] = React.useState('');

  const { accessToken, userId } = React.useContext(TokenContext);
  if (accessToken === null) {
    return <Navigate to='/login' />;
  }

  // Allowed file types for thumbnail and song
  let allowedImageFiles = ['image/jpeg', 'image/jpg', 'image/png'];
  let allowedAudioFiles = ['audio/mp3', 'audio/mpeg'];

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Fields to validate: title, audio, instrument, difficulty, thumbnail
    if (song === '') {
      showErrorMessage('Song name cannot be empty');
      return;
    } else if (songFile === '' || !allowedAudioFiles.includes(songFile.type)) {
      showErrorMessage('You must upload a .mp3 or .mpeg file of the song');
      return;
    } else if (instrument === '') {
      showErrorMessage('Instrument field cannot be empty');
      return;
    } else if (isNaN(parseFloat(diff)) || parseFloat(diff) < 1 || parseFloat(diff) > 5) {
      showErrorMessage('Difficulty must be a float from 1 to 5');
      return;
    } else if (thumbnail === '' || !allowedImageFiles.includes(thumbnail.type)) {
      showErrorMessage('Thumbnail is an unsupported file type (accepted: .jpeg, .jpg, .png)');
      return;
    }

    try {
      const songInfo = {
        userId: userId,
        composer: artist,
        thumbnail: thumbnail === defaultImage ? '' : await getBase64(thumbnail),
        genreTags: mapCommaStringToArray(genreTags),
        instrument: instrument,
        title: song,
        difficulty: diff,
      };

      const response = await axios.post(
        'http://localhost:5001/files/user/create-private-song',
        { ...songInfo },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await uploadFileToS3(response.data.uploader, songFile);
    } catch (err) {
      showErrorMessage(err.response.data.error);
    }
  };

  return (
    <>
      <NavBar></NavBar>
      <PageBlock>
        <StyledHeader>Create an experiment</StyledHeader>
        <UploadForm onSubmit={handleSubmit} noValidate>
          <ImgContainer>
            <ImgRight src={thumbnail} />
            <InputFileUpload
              innerText='Upload a thumbnail'
              width='60%'
              fontSize='1.1rem'
              accept='image/*'
              backgroundColor='#2C2C2C'
              hoverColor='#3D3D3D'
              onChangeEvent={(p) => setThumbnail(p.target.files[0])}
            />
          </ImgContainer>

          <TextFieldsContainer>
            <TextField
              label='Song Name'
              id='song-name-field'
              value={song}
              onChange={(s) => setSong(s.target.value)}
            />
            <TextField
              label='Artist'
              id='artist-field'
              value={artist}
              onChange={(a) => setArtist(a.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id='select-instrument-label'>Instrument</InputLabel>
              <Select
                label='Instrument'
                labelId='select-instrument-label'
                id='select-instrument'
                value={instrument}
                onChange={(i) => setInstrument(i.target.value)}
              >
                <MenuItem value='piano'>Piano</MenuItem>
                <MenuItem value='guitar'>Guitar</MenuItem>
                <MenuItem value='violin'>Violin</MenuItem>
                <MenuItem value='cello'>Cello</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Difficulty (1-5)'
              id='difficulty-field'
              value={diff}
              onChange={(d) => setDiff(d.target.value)}
            />
            <TextField
              label='Genre tags (separate with a comma e.g. classical,baroque)'
              id='genre-tags-field'
              value={genreTags}
              onChange={(g) => setGenreTags(g.target.value)}
            />
            <InputFileUpload
              innerText='Upload song file (.mp3)'
              fontSize='1rem'
              accept='audio/mp3, audio/mpeg'
              backgroundColor='#1b998b'
              hoverColor='#1fad9e'
              onChangeEvent={(p) => setSongFile(p.target.files[0])}
            />
            <SubmitButton type='submit' id='submit-song-button'>
              Submit
            </SubmitButton>
          </TextFieldsContainer>
        </UploadForm>
      </PageBlock>
    </>
  );
};

export default Create;
