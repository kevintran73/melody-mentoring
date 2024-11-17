import React from 'react';
import { styled } from '@mui/material';

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MetronomeIcon from './MetronomeIcon';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DoneIcon from '@mui/icons-material/Done';

const UnstyledButtonContainer = styled('button')({
  background: 'none',
  border: 'none',
  padding: '0',
  margin: '0',
  cursor: 'pointer',
  zIndex: '998',
});

const StyledAudio = styled('audio')({
  width: '350px',
  position: 'relative',
});

const StyledVideo = styled('video')({
  width: '350px',
  position: 'relative',
});

const ToolBarBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '15px',
  position: 'fixed',
  bottom: '20px',
});

const ToolBar = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
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

const StyledExit = styled(ExitToAppIcon)({
  fontSize: '50px',
  color: '#cc0029',
  transform: 'rotate(180deg)',
});

const StyledDone = styled(DoneIcon)({
  fontSize: '50px',
  color: '#2bba52',
});

const ExperimentToolbar = ({
  experimentStarted,
  mediaBlobUrl,
  countdown,
  osmdRef,
  osmdMuted,
  osmdMetroMuted,
  initiateCountdown,
  onRecordingStop,
  retryAttempt,
  onExit,
  finishAttempt,
  hasWebcam,
}) => {
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
    <ToolBarBlock>
      {!hasWebcam && experimentStarted && mediaBlobUrl && countdown === -1 && (
        <StyledAudio src={mediaBlobUrl} controls />
      )}
      {hasWebcam && experimentStarted && mediaBlobUrl && countdown === -1 && (
        <StyledVideo src={mediaBlobUrl} controls />
      )}
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
          <UnstyledButtonContainer onClick={onExit} title='Exit experiment'>
            <StyledExit />
          </UnstyledButtonContainer>
          {experimentStarted && mediaBlobUrl && countdown === -1 && (
            <UnstyledButtonContainer onClick={finishAttempt} title='Finish attempt'>
              <StyledDone />
            </UnstyledButtonContainer>
          )}
        </ToolbarRightPill>
      </ToolBar>
    </ToolBarBlock>
  );
};

export default ExperimentToolbar;
