import React from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import * as Tone from 'tone';

import { Button, styled, Typography, CircularProgress } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MetronomeIcon from '../components/experiment/MetronomeIcon';
import DoneIcon from '@mui/icons-material/Done';

import NavBar from '../components/nav_bar/NavBar';
import OpenSheetMusicDisplay from '../components/experiment/OpenSheetMusicDisplay';

import odeToJoy from '../assets/Ode_to_Joy_Easy.mxl';
import moonlightSonata from '../assets/Sonate_No._14_Moonlight_3rd_Movement.mxl';

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

const UnstyledButtonContainer = styled('button')({
  background: 'none',
  border: 'none',
  padding: '0',
  margin: '0',
  cursor: 'pointer',
  zIndex: '998',
});

const ToolBar = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  position: 'fixed',
  bottom: '20px',
});

const MainToolBarCircle = styled('div')({
  height: '90px',
  width: '90px',
  backgroundColor: '#ededed',
  borderRadius: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ToolBarLeftPill = styled('span')({
  position: 'relative',
  left: '50px',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingLeft: '15px',
  paddingRight: '55px',
  backgroundColor: '#dfdfdf',
  borderRadius: '50px',
  width: '200px',
  height: '60px',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
});

const ToolbarRightPill = styled('span')({
  position: 'relative',
  right: '50px',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingLeft: '55px',
  paddingRight: '15px',
  backgroundColor: '#dfdfdf',
  borderRadius: '50px',
  width: '200px',
  height: '60px',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
});

const StyledPlayArrow = styled(PlayArrowRoundedIcon)({
  fontSize: '60px',
  color: '#2161cc',
});

const StyledStop = styled(StopRoundedIcon)({
  fontSize: '60px',
  color: '#ed4d3e',
});

const StyledReplay = styled(ReplayIcon)({
  fontSize: '60px',
  color: '#3b3b3b',
});

const StyledVolumeUp = styled(VolumeUpIcon)({
  fontSize: '50px',
  color: '#3b3b3b',
});

const StyledVolumeOff = styled(VolumeOffIcon)({
  fontSize: '50px',
  color: '#3b3b3b',
});

const StyledMetronome = styled(MetronomeIcon)({
  width: '50px',
  height: '50px',
  color: '#3b3b3b',
});

const StyledDone = styled(DoneIcon)({
  fontSize: '50px',
  color: '#0fbf3d',
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

// const StopRecordingOverlay = ({ onClickEvent }) => {
//   return (
//     <PageOverlay>
//       <div>
//         <StopButton onClick={onClickEvent} filled>
//           Stop Recording
//         </StopButton>
//       </div>
//     </PageOverlay>
//   );
// };

/**
 * Experiment page
 */
const Experiment = () => {
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

  const toggleMusicMute = () => {
    if (osmdRef.current) {
      osmdRef.current.toggleMuteMusic();
    }
  };

  const toggleMetronome = () => {
    if (osmdRef.current) {
      osmdRef.current.toggleMetronome();
    }
  };

  return (
    <>
      <NavBar></NavBar>
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

        {experimentStarted && (
          <div>
            {mediaBlobUrl && countdown === -1 && (
              <>
                <audio src={mediaBlobUrl} controls />
              </>
            )}
          </div>
        )}
      </PageBlock>

      <ToolBar>
        <ToolBarLeftPill>
          {!osmdMuted && (
            <UnstyledButtonContainer onClick={toggleMusicMute} title='Mute sound'>
              <StyledVolumeUp />
            </UnstyledButtonContainer>
          )}
          {osmdMuted && (
            <UnstyledButtonContainer onClick={toggleMusicMute} title='Unmute sound'>
              <StyledVolumeOff />
            </UnstyledButtonContainer>
          )}
          <UnstyledButtonContainer onClick={toggleMetronome} title='Toggle metronome'>
            <StyledMetronome crossedOut={osmdMetroMuted} />
          </UnstyledButtonContainer>
        </ToolBarLeftPill>

        {!experimentStarted && countdown === null && (
          <UnstyledButtonContainer onClick={initiateCountdown} title='Begin attempt'>
            <MainToolBarCircle>
              <StyledPlayArrow />
            </MainToolBarCircle>
          </UnstyledButtonContainer>
        )}
        {countdown !== null && countdown !== -1 && !mediaBlobUrl && (
          <UnstyledButtonContainer onClick={onRecordingStop} title='Stop attempt'>
            <MainToolBarCircle>
              <StyledStop />
            </MainToolBarCircle>
          </UnstyledButtonContainer>
        )}
        {experimentStarted && mediaBlobUrl && countdown === -1 && (
          <UnstyledButtonContainer onClick={retryAttempt} title='Retry attempt'>
            <MainToolBarCircle>
              <StyledReplay />
            </MainToolBarCircle>
          </UnstyledButtonContainer>
        )}

        <ToolbarRightPill>
          {experimentStarted && mediaBlobUrl && countdown === -1 && (
            <UnstyledButtonContainer onClick={finishAttempt} title='Finish attempt'>
              <StyledDone />
            </UnstyledButtonContainer>
          )}
        </ToolbarRightPill>
      </ToolBar>
    </>
  );
};

export default Experiment;
