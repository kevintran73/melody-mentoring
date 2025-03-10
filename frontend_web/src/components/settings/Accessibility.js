import React from 'react';
import { styled } from '@mui/system';

import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

const HeaderBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const SectionHeader = styled('h2')({
  fontSize: '1.25rem',
  fontWeight: 'bold',
});

const SectionDesc = styled('p')({
  fontSize: '1rem',
  color: '#2b2b2b',
  width: 'auto',
});

const SectionBlock = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '50px',

  '@media (max-width: 750px)': {
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '5px',
  },
});

const DividerLine = styled('hr')({
  border: 'none',
  borderTop: '1px solid #9c9c9c',
  width: 'auto',
  margin: '25px 0',
});

const SliderBlock = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  width: '100%',
});

const ContinuousSlider = () => {
  let volume = 100;
  if (localStorage.getItem('volume') !== null) {
    volume = parseInt(localStorage.getItem('volume'));
  }
  const [value, setValue] = React.useState(volume);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem('volume', newValue);
  };

  return (
    <SliderBlock>
      <VolumeDown />
      <Slider
        aria-label='Volume'
        value={value}
        valueLabelDisplay='auto'
        step={10}
        marks
        min={10}
        max={100}
        onChange={handleChange}
        sx={{ flexGrow: 1 }}
      />
      <VolumeUp />
    </SliderBlock>
  );
};

/**
 * Accessibility settings block
 */
const Accessibility = () => {
  return (
    <>
      <HeaderBlock>
        <SectionHeader>Accessibility</SectionHeader>
        <SectionDesc>
          Adjust settings to enhance the accessibility and usability of the website
        </SectionDesc>
      </HeaderBlock>

      <DividerLine />

      <SectionBlock>
        <HeaderBlock>
          <SectionHeader>Volume</SectionHeader>
          <SectionDesc>Adjust playback volume</SectionDesc>
        </HeaderBlock>
        <ContinuousSlider />
      </SectionBlock>

      <DividerLine />
    </>
  );
};

export default Accessibility;
