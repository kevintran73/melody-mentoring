import React from 'react';

const MetronomeIcon = ({ width = '1em', height = '1em', crossedOut = true, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      <path
        fill='currentColor'
        d='m12 1.75l-3.43.92l-4.51 16.86c-.03.15-.06.31-.06.47c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2c0-.16-.03-.32-.06-.47l-1.36-5.11L17 16l.2 1h-3.79l2.84-2.84l-1.41-1.41L10.59 17H6.8l3.49-13h3.42l1.46 5.43l1.63-1.64l-1.37-5.12zM11.25 5v9.75l1.5-1.5V5zm8.54 2.8l-2.83 2.83l-.71-.71l-1.41 1.42l2.82 2.82l1.42-1.41l-.71-.71l2.83-2.83z'
      />
      {crossedOut && (
        <>
          <line
            x1='0'
            y1='3'
            x2='24'
            y2='22'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='butt'
          />
        </>
      )}
    </svg>
  );
};

export default MetronomeIcon;
