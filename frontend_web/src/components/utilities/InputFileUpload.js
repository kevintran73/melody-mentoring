import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledButton = styled(Button)({
  color: '#ffffff',
  backgroundColor: '#2C2C2C',
  '&:hover': {
    backgroundColor: '#3D3D3D',
  },
});

/**
 * MUI template for video and audio file input fields
 */
const InputFileUpload = ({ innerText, onChangeEvent, width = '100%', fontSize = '1rem' }) => {
  return (
    <StyledButton
      id='upload-file'
      component='label'
      role={undefined}
      variant='contained'
      tabIndex={-1}
      sx={{ width, fontSize }}
    >
      {innerText}
      <VisuallyHiddenInput
        type='file'
        accept='audio/*, video/*'
        multiple={false}
        onChange={onChangeEvent}
      />
    </StyledButton>
  );
};

export default InputFileUpload;
