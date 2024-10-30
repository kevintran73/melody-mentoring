import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactMediaRecorder } from 'react-media-recorder';
import * as Tone from 'tone';

import { Button, styled, Typography, CircularProgress } from '@mui/material';

import NavBar from '../components/nav_bar/NavBar';
import OpenSheetMusicDisplay from '../components/experiment/OpenSheetMusicDisplay';

import odeToJoy from '../assets/Ode_to_Joy_Easy.mxl';
import moonlightSonata from '../assets/Sonate_No._14_Moonlight_3rd_Movement.mxl';
import ExperimentToolbar from '../components/experiment/ExperimentToolbar';

const PageBlock = styled('div')({
  height: 'calc(100vh - 70px)',
  paddingLeft: '2rem',
  paddingRight: '2rem',
  overflowY: 'auto',
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

  const finishAttempt = () => {
    // Upload mediaBlobUrl to database
  };

  // Exit experiment
  const onExit = () => {
    onRecordingStop();
    clearBlobUrl();
    setCountdown(null);
    setExperimentStarted(false);

    // Navigate back to the experiment's song page
    navigate('/catalogue');
  };

  return (
    <>
      <NavBar isDisabled={countdown !== null && countdown !== -1 && !mediaBlobUrl} />
      <PageBlock ref={pageBlockRef}>
        {!experimentStarted && countdown !== 0 && countdown !== null && (
          <CountdownOverlay innerText={countdown} />
        )}
        {!osmdLoaded && (
          <LoadingOverlay>
            <CircularProgress size='45vh' />
          </LoadingOverlay>
        )}
        <OpenSheetMusicDisplay
          ref={osmdRef}
          file={odeToJoy}
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
  );
};

export default Experiment;
