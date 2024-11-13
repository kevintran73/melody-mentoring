import React from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  getBase64,
  mapCommaStringToArray,
  showErrorMessage,
  showSuccessMessage,
  showUploadingMessage,
  uploadFileToS3,
} from '../helpers';

import TokenContext from '../context/TokenContext';

import defaultImage from '../assets/default-img.png';
import NavBar from '../components/nav_bar/NavBar';

import { styled } from '@mui/material';
import CreateUploadForm from '../components/create/CreateUploadForm';

const StyledHeader = styled('h1')({
  fontSize: '2rem',
  marginBottom: '0.5rem',
  color: '#3f3f3f',

  '@media (max-width: 900px)': {
    fontSize: '2.2rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  '@media (max-width: 450px)': {
    fontSize: '1.9rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const PageBlock = styled('div')({
  margin: '1rem 2.5rem',
  overflowY: 'auto',

  '@media (max-width: 900px)': {
    margin: '2rem 2rem',
  },
});

const options = [
  {value: 'daniel', label: 'Daniel'},
  {value: 'jennifer', label: 'Jennifer'},
  {value: 'jerome', label: 'Jerome'},
];

/**
 * Create experiment page
 */
const Create = () => {
  const [thumbnail, setThumbnail] = React.useState(defaultImage);
  const [song, setSong] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [diff, setDiff] = React.useState('');
  const [genreTag, setGenreTag] = React.useState('');
  const [instrument, setInstrument] = React.useState('');
  const [sheetFile, setSheetFile] = React.useState('');

  const navigate = useNavigate();

  const { accessToken, userId } = React.useContext(TokenContext);
  if (accessToken === null) {
    return <Navigate to='/login' />;
  }

  // Allowed file types for thumbnail
  let allowedImageFiles = ['image/jpeg', 'image/jpg', 'image/png'];

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Fields to validate: title, sheet, instrument, difficulty, thumbnail
    if (song === '') {
      showErrorMessage('Song name cannot be empty');
      return;
    } else if (
      sheetFile === '' ||
      (sheetFile.name.lastIndexOf('.mxl') === -1 && sheetFile.name.lastIndexOf('.musicxml') === -1)
    ) {
      showErrorMessage('You must upload a .xml or .musicxml file of the sheet');
      return;
    } else if (instrument === '') {
      showErrorMessage('Instrument field cannot be empty');
      return;
    } else if (isNaN(parseFloat(diff)) || parseFloat(diff) < 1 || parseFloat(diff) > 5) {
      showErrorMessage('Difficulty must be a float from 1 to 5');
      return;
    } else if (thumbnail !== defaultImage && !allowedImageFiles.includes(thumbnail.type)) {
      showErrorMessage('Thumbnail is an unsupported file type (accepted: .jpeg, .jpg, .png)');
      return;
    } else if (genreTag === '') {
      showErrorMessage('Genre field cannot be empty');
      return;
    }

    showUploadingMessage('Uploading song...');
    try {
      const songInfo = {
        userId: userId,
        composer: artist,
        thumbnail: thumbnail === defaultImage ? '' : await getBase64(thumbnail),
        genreTags: mapCommaStringToArray(genreTag),
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

      await uploadFileToS3(response.data.sheetUploader, sheetFile);
      showSuccessMessage('Success! Your song was successfully uploaded.');

      // Reset state variables to default
      setThumbnail(defaultImage);
      setSong('');
      setArtist('');
      setDiff('');
      setGenreTag('');
      setInstrument('');

      return navigate('/catalogue');
    } catch (err) {
      showErrorMessage(err.response.data.error);
      return;
    }
  };

  return (
    <>
      <NavBar />
      <PageBlock>
        <StyledHeader>Create an experiment</StyledHeader>

        <CreateUploadForm
          handleSubmit={handleSubmit}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          song={song}
          setSong={setSong}
          artist={artist}
          setArtist={setArtist}
          instrument={instrument}
          setInstrument={setInstrument}
          diff={diff}
          setDiff={setDiff}
          genreTag={genreTag}
          setGenreTag={setGenreTag}
          setSheetFile={setSheetFile}
        />
      </PageBlock>
    </>
  );
};

export default Create;
