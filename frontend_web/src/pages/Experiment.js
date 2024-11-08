import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactMediaRecorder } from 'react-media-recorder';
import * as Tone from 'tone';
import JSZip from 'jszip';

import { Button, styled, Typography, CircularProgress } from '@mui/material';

import NavBar from '../components/nav_bar/NavBar';
import OpenSheetMusicDisplay from '../components/experiment/OpenSheetMusicDisplay';

import odeToJoy from '../assets/Ode_to_Joy_Easy.mxl';
import moonlightSonata from '../assets/Sonate_No._14_Moonlight_3rd_Movement.mxl';
import ExperimentToolbar from '../components/experiment/ExperimentToolbar';
import axios from 'axios';
import TokenContext from '../context/TokenContext';
import { showErrorMessage, uploadFileToS3 } from '../helpers';

const PageBlock = styled('div')({
  height: 'calc(100vh - 70px)',
  paddingLeft: '2rem',
  paddingRight: '2rem',
  overflowY: 'auto',

  '@media (max-width: 700px)': {
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },

  '@media (max-width: 500px)': {
    paddingLeft: '0',
    paddingRight: '0',
  },
});

const PageOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

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

const CountdownOverlay = ({ innerText }) => {
  return (
    <PageOverlay>
      <div>
        <Typography variant='h1' style={{ color: 'white' }}>
          {innerText}
        </Typography>
      </div>
    </PageOverlay>
  );
};

/**
 * Experiment page
 */
const Experiment = () => {
  const navigate = useNavigate();

  const [experimentStarted, setExperimentStarted] = React.useState(false);
  const [countdown, setCountdown] = React.useState(null);

  const pageBlockRef = React.useRef();
  const osmdRef = React.useRef();
  const [osmdLoaded, setOsmdLoaded] = React.useState(false);
  const [osmdMuted, setOsmdMuted] = React.useState(
    osmdRef.current ? osmdRef.current.isMusicMuted() : false
  );
  const [osmdMetroMuted, setOsmdMetroMuted] = React.useState(
    osmdRef.current ? osmdRef.current.isMetronomeMuted() : false
  );

  const onOsmdLoad = () => {
    setOsmdLoaded(true);
  };

  // Audio recording hooks
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      video: false,
    });

  // After countdown is initiated
  React.useEffect(() => {
    let timer;

    // Reduce countdown by 1 or start experiment if 0 reached
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else if (countdown === 0 && !experimentStarted) {
      setExperimentStarted(true);
      startRecording();
    }

    return () => clearTimeout(timer);
  }, [countdown, experimentStarted, startRecording]);

  // Begin song after status is "recording"
  React.useEffect(() => {
    if (status === 'recording') {
      if (osmdRef.current) {
        osmdRef.current.beginSong();
      }
    }
  }, [status]);

  // Get the sheet music
  const { accessToken, userId } = React.useContext(TokenContext);
  const params = useParams();
  const [sheetFile, setSheetFile] = React.useState('');
  React.useEffect(() => {
    // Navigate to login page if invalid token
    if (accessToken === null) {
      return navigate('/login');
    }

    const getSheet = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/files/sheets/${params.songId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Download the sheet from the URL and store on local browser
        const sheetResponse = await fetch(response.data.url);
        const blob = await sheetResponse.blob();
        const zip = await JSZip.loadAsync(blob);
        const xmlFile = Object.values(zip.files).find(
          (file) => file.name.endsWith('.xml') && !file.name.includes('META-INF')
        );

        // If xmlFile found
        if (xmlFile) {
          // Convert the XML file to a string
          const xmlContent = await xmlFile.async('string');
          setSheetFile(xmlContent);
        } else {
          return navigate('/catalogue');
        }
      } catch (err) {
        showErrorMessage(err.data.response.error);

        // Navigate to catalogue if invalid song id or any other issues with retrieving sheet
        return navigate('/catalogue');
      }
    };

    getSheet();
  }, [accessToken, params, navigate]);

  // Trigger the countdown for a song beginning
  const initiateCountdown = async () => {
    if (pageBlockRef.current) {
      pageBlockRef.current.scrollTop = 0;
    }

    setCountdown(5);
    await Tone.start();
  };

  const onRecordingStop = () => {
    stopRecording();
    setCountdown(-1);

    if (osmdRef.current) {
      osmdRef.current.endSong();
    }
  };

  const retryAttempt = () => {
    // Scroll to top of sheet
    if (pageBlockRef.current) {
      pageBlockRef.current.scrollTop = 0;
    }

    clearBlobUrl();
    setExperimentStarted(false);
    initiateCountdown();
  };

  const finishAttempt = async () => {
    // Upload mediaBlobUrl to database
    try {
      const response = await axios.post(
        'http://localhost:5001/files/user/new-track-attempt',
        { userId: userId, songId: params.songId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Convert blob url to File object and upload to S3
      const blobResponse = await fetch(mediaBlobUrl);
      const blob = await blobResponse.blob();
      const blobFile = new File([blob], `${userId}-${params.songId}-attempt-new`, {
        type: blob.type,
      });
      await uploadFileToS3(response.data.audioUploader, blobFile);
    } catch (err) {
      showErrorMessage(err.response.data.error);
      return;
    }

    return navigate('/history');
  };

  // Exit experiment
  const onExit = () => {
    onRecordingStop();
    clearBlobUrl();
    setCountdown(null);
    setExperimentStarted(false);

    // Navigate back to the experiment's song page
    return navigate('/catalogue');
  };

  // Display all page elements only if sheet file has been retrieved
  return (
    <>
      <NavBar isDisabled={countdown !== null && countdown !== -1 && !mediaBlobUrl} />
      {!osmdLoaded && (
        <LoadingOverlay>
          <CircularProgress size='40vh' />
        </LoadingOverlay>
      )}
      {sheetFile !== '' && (
        <>
          <PageBlock ref={pageBlockRef}>
            {!experimentStarted && countdown !== 0 && countdown !== null && (
              <CountdownOverlay innerText={countdown} />
            )}
            <OpenSheetMusicDisplay
              ref={osmdRef}
              file={sheetFile}
              onLoad={onOsmdLoad}
              onMuteToggle={(b) => setOsmdMuted(b)}
              onMetroMuteToggle={(b) => setOsmdMetroMuted(b)}
            />
          </PageBlock>

          <ExperimentToolbar
            experimentStarted={experimentStarted}
            mediaBlobUrl={mediaBlobUrl}
            countdown={countdown}
            osmdRef={osmdRef}
            osmdMuted={osmdMuted}
            osmdMetroMuted={osmdMetroMuted}
            initiateCountdown={initiateCountdown}
            onRecordingStop={onRecordingStop}
            retryAttempt={retryAttempt}
            onExit={onExit}
            finishAttempt={finishAttempt}
          />
        </>
      )}
    </>
  );
};

export default Experiment;
