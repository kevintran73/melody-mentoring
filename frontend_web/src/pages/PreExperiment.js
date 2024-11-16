import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../context/TokenContext';
import { showErrorMessage } from '../helpers';

import defaultImage from '../assets/default-img.png';

import { styled } from '@mui/system';
import { Button, CircularProgress } from '@mui/material';

import NavBar from '../components/nav_bar/NavBar';
import UploadRecordingModal from '../components/experiment/UploadRecordingModal';

const LoadingOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
});

const PageBlock = styled('div')({
  padding: '1.5rem 2.5rem',
  height: 'calc(100vh - 70px)',
  overflowY: 'auto',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (max-width: 1000px)': {
    display: 'block',
  },

  '@media (max-height: 800px)': {
    display: 'block',
  },
});

const PageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  gap: '50px',
  alignItems: 'center',
  padding: '2rem 4rem',
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',

  '@media (max-width: 1000px)': {
    flexDirection: 'column',
    gap: '0',
  },

  '@media (max-height: 800px)': {
    flexDirection: 'column',
    gap: '0',
  },
});

const PageHalf = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const SongThumbnail = ({ ...props }) => <ResponseSongThumbnail {...props} />;

const StyledSongThumbnail = styled('div')`
  height: 300px;
  width: 300px;
  object-fit: cover;
  background-color: #f2f2f2;
  background-image: ${(props) =>
    props.thumbnail === '' ? `url(${defaultImage})` : `url(${props.thumbnail})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex: 0 0 auto;
  border-radius: 20px;
  margin-top: 0.25rem;
`;

const ResponseSongThumbnail = styled(StyledSongThumbnail)({
  '@media (min-width: 1001px)': {
    width: '400px',
    height: '400px',
  },
});

const SongInfoMain = styled('div')({
  paddingTop: '1rem',
  textAlign: 'center',
});

const SongInfoSecondary = styled('div')({
  marginTop: '1.5rem',
  padding: '1.25rem 2rem',
  textAlign: 'center',
  borderRadius: '20px',
  backgroundColor: '#525252',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const StyledHeader1 = styled('h1')({
  fontSize: '3rem',
  fontWeight: 'bold',
});

const StyledHeader2 = styled('h2')({
  fontSize: '1.75rem',
});

const StyledText1 = styled('p')({
  fontSize: '1.4rem',
  color: 'white',
});

const RecordingSelectBlock = styled('div')({
  paddingTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const RecordingBlock = styled('div')({
  paddingTop: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
});

const StyledText2 = styled('p')({
  color: '#3b3b3b',
});

const NavExperimentPageButton = styled(Button)({
  width: '250px',
  color: 'white',
  backgroundColor: '#2C2C2C',
  fontSize: '1.2rem',

  '&:hover': {
    backgroundColor: '#3D3D3D',
  },
});

const PreExperiment = () => {
  const { accessToken, userId } = React.useContext(TokenContext);
  const navigate = useNavigate();
  const params = useParams();

  // Get song info and do page validation checks
  const [songInfo, setSongInfo] = React.useState(null);
  React.useEffect(() => {
    // Navigate to login page if invalid access token
    if (accessToken === null) {
      return navigate('/login');
    }

    /*
    check for invalid songId
    */

    // Get the song info
    const getSongInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/catalogue/songs/find/${params.songId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setSongInfo(response.data);
      } catch (err) {
        showErrorMessage(err.response.data.error);
        return navigate('/catalogue');
      }
    };

    getSongInfo();
  }, [accessToken, params, navigate]);

  const navExperiment = () => {
    return navigate(`/experiment/${params.songId}`);
  };

  return (
    <>
      <NavBar />
      {songInfo === null && (
        <LoadingOverlay>
          <CircularProgress size='40vh' />
        </LoadingOverlay>
      )}
      {songInfo !== null && (
        <PageBlock>
          <PageContainer>
            <PageHalf>
              <SongThumbnail thumbnail={songInfo.thumbnail} />
            </PageHalf>

            <PageHalf>
              <SongInfoMain>
                <StyledHeader1>{songInfo.title}</StyledHeader1>
                <StyledHeader2>{songInfo.composer}</StyledHeader2>
              </SongInfoMain>

              <SongInfoSecondary>
                <StyledText1>
                  Instrument: <b>{`${songInfo.instrument}`}</b>
                </StyledText1>
                <StyledText1>
                  Difficulty: <b>{`${songInfo.difficulty}`}</b>
                </StyledText1>
              </SongInfoSecondary>

              <RecordingSelectBlock>
                <RecordingBlock>
                  <StyledText2>Already recorded this song?</StyledText2>
                  <UploadRecordingModal
                    id='upload-recording-modal'
                    navigate={navigate}
                    userId={userId}
                    songId={params.songId}
                    accessToken={accessToken}
                  />
                </RecordingBlock>

                <RecordingBlock>
                  <StyledText2>Record a new track attempt</StyledText2>
                  <NavExperimentPageButton onClick={navExperiment} id='nav-experiment'>
                    Go to experiment
                  </NavExperimentPageButton>
                </RecordingBlock>
              </RecordingSelectBlock>
            </PageHalf>
          </PageContainer>
        </PageBlock>
      )}
    </>
  );
};

export default PreExperiment;
