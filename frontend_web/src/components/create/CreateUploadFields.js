import React from 'react';

import defaultImage from '../../assets/default-img.png';
import InputFileUpload from '../utilities/InputFileUpload';

import { styled, useMediaQuery } from '@mui/material';
import { Button, TextField, FormControl, InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const ImgContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px',
  width: '35%',
  height: '100%',

  '@media (max-width: 900px)': {
    width: '100%',
    height: '100%',
    gap: '20px',
    marginBottom: '1rem',
  },
});

const TextFieldsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
  width: '58%',

  '@media (max-width: 900px)': {
    width: '90%',
  },
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

  '@media (max-width: 900px)': {
    marginBottom: '1rem',
  },
});

const UploadForm = styled('form')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'center',
  gap: '30px',
  marginTop: '2rem',
  padding: '3rem 2rem',
  border: '1px solid gray',
  borderRadius: '10px',
  width: '100%',

  '@media (max-width: 900px)': {
    border: 'none',
    padding: '0',
    flexDirection: 'column',
    height: 'auto',
    width: 'auto',
  },
});

const ExperimentThumbnail = ({ ...props }) => <ResponsiveExperimentThumbnail {...props} />;

const StyledExperimentThumbnail = styled('div')`
  height: 300px;
  width: 300px;
  object-fit: cover;
  background-color: #f2f2f2;
  background-image: ${(props) =>
    props.thumbnail === defaultImage ? `url(${defaultImage})` : `url(${props.thumbnail})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex: 0 0 auto;
  border-radius: 20px;
  margin-top: 0.25rem;
`;

const ResponsiveExperimentThumbnail = styled(StyledExperimentThumbnail)({
  '@media (min-width: 901px)': {
    width: '25vw',
    height: '25vw',
  },
});

const CreateUploadForm = ({
  handleSubmit,
  thumbnail,
  setThumbnail,
  song,
  setSong,
  artist,
  setArtist,
  instrument,
  setInstrument,
  diff,
  setDiff,
  genreTags,
  setGenreTags,
  setSheetFile,
}) => {
  const isSmallScreen = useMediaQuery('(max-width: 900px)');

  return (
    <UploadForm onSubmit={handleSubmit} noValidate>
      <ImgContainer>
        <ExperimentThumbnail
          thumbnail={thumbnail === defaultImage ? defaultImage : URL.createObjectURL(thumbnail)}
        />
        {isSmallScreen ? (
          <InputFileUpload
            innerText='Upload a thumbnail'
            id='upload-thumbnail-button'
            width='240px'
            fontSize='1.1rem'
            accept='image/*'
            backgroundColor='#2C2C2C'
            hoverColor='#3D3D3D'
            onChangeEvent={(p) => setThumbnail(p.target.files[0])}
          />
        ) : (
          <InputFileUpload
            innerText='Upload a thumbnail'
            id='upload-thumbnail-button'
            width='65%'
            fontSize='1.1rem'
            accept='image/*'
            backgroundColor='#2C2C2C'
            hoverColor='#3D3D3D'
            onChangeEvent={(p) => setThumbnail(p.target.files[0])}
          />
        )}
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
          innerText='Upload sheet music (.mxl or .musicxml)'
          id='upload-sheet-button'
          fontSize='1rem'
          accept='.mxl, .musicxml'
          backgroundColor='#1b998b'
          hoverColor='#1fad9e'
          onChangeEvent={(s) => setSheetFile(s.target.files[0])}
        />
        <SubmitButton type='submit' id='submit-new-experiment-button'>
          Submit
        </SubmitButton>
      </TextFieldsContainer>
    </UploadForm>
  );
};

export default CreateUploadForm;
