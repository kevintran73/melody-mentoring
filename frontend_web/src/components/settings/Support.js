import React from 'react';
import { styled } from '@mui/system';

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
  whiteSpace: 'nowrap',
});

const SectionBlock = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '50px',
});

const DividerLine = styled('hr')({
  border: 'none',
  borderTop: '1px solid #9c9c9c',
  width: 'auto',
  margin: '25px 0',
});

/**
 * Support settings block
 */
const Support = () => {
  return (
    <>
      <HeaderBlock>
        <SectionHeader>Support</SectionHeader>
        <SectionDesc>
          Access help resources, contact support, and find answers to frequently asked questions
        </SectionDesc>
      </HeaderBlock>
      <DividerLine />
    </>
  );
};

export default Support;
