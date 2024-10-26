import React from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

import { Button, styled, Typography } from '@mui/material';
import NavBar from '../components/nav_bar/NavBar';
import OpenSheetMusicDisplay from '../components/experiment/OpenSheetMusicDisplay';

import odeToJoy from '../assets/Ode_to_Joy_Easy.mxl';

const PageBlock = styled('div')({
  height: 'calc(100vh - 70px - 2rem)',
  padding: '1rem 2.5rem',
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

const StopButton = styled('button')({
  color: 'white',
  fontSize: '5rem',
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

const StopRecordingOverlay = ({ onClickEvent }) => {
  return (
    <PageOverlay>
      <div>
        <StopButton onClick={onClickEvent}>Stop Recording</StopButton>
      </div>
    </PageOverlay>
  );
};

/**
 * Experiment page
 */
const Experiment = () => {
  const [experimentStarted, setExperimentStarted] = React.useState(false);
  const [countdown, setCountdown] = React.useState(null);
  const osmdRef = React.useRef();

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

  const initiateCountdown = () => {
    setCountdown(5);
  };

  const onRecordingStop = () => {
    stopRecording();
    setCountdown(-1);

    if (osmdRef.current) {
      osmdRef.current.endSong();
    }
  };

  const retryAttempt = () => {
    clearBlobUrl();
    setExperimentStarted(false);
    initiateCountdown();
  };

  const finishAttempt = () => {
    // Upload mediaBlobUrl to database
  };

  return (
    <>
      <NavBar></NavBar>
      <PageBlock>
        {!experimentStarted && countdown === null && (
          <Button onClick={initiateCountdown}>Begin</Button>
        )}

        <OpenSheetMusicDisplay ref={osmdRef} file={odeToJoy} />

        {!experimentStarted && countdown !== 0 && countdown !== null && (
          <CountdownOverlay innerText={countdown} />
        )}

        {experimentStarted && (
          <div>
            <p>{status}</p>
            {!mediaBlobUrl && <StopRecordingOverlay onClickEvent={onRecordingStop} />}
            {mediaBlobUrl && countdown === -1 && (
              <>
                <audio src={mediaBlobUrl} controls />
                <Button onClick={retryAttempt}>Retry attempt</Button>
                <Button onClick={finishAttempt}>Finish attempt</Button>
              </>
            )}
          </div>
        )}
      </PageBlock>
    </>
  );
};

export default Experiment;
