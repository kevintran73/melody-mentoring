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
});

/**
 * MUI template for video and audio file input fields
 */
const InputFileUpload = ({
  innerText,
  onChangeEvent,
  width = '100%',
  fontSize = '1rem',
  accept,
  backgroundColor,
  hoverColor,
}) => {
  return (
    <StyledButton
      id='upload-file'
      component='label'
      role={undefined}
      variant='contained'
      tabIndex={-1}
      sx={{
        width,
        fontSize,
        backgroundColor: backgroundColor,
        '&:hover': {
          backgroundColor: hoverColor,
        },
      }}
    >
      {innerText}
      <VisuallyHiddenInput type='file' accept={accept} multiple={false} onChange={onChangeEvent} />
    </StyledButton>
  );
};

export default InputFileUpload;
