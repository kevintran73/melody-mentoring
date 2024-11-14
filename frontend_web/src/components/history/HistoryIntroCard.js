import Card from '@mui/material/Card';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import React from 'react';

// let theme = createTheme();

// theme.typography.h3 = {
//   fontSize: '1.2rem',
//   [theme.breakpoints.up('sm')]: {
//     fontSize: '2rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '3rem',
//   },
//   [theme.breakpoints.up('lg')]: {
//     fontSize: '4rem',
//   },
// };

// theme.typography.h4 = {
//   fontSize: '1.0rem',
//   [theme.breakpoints.up('sm')]: {
//     fontSize: '1.1rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '1.5rem',
//   },
//   [theme.breakpoints.up('lg')]: {
//     fontSize: '1.8rem',
//   },
// };

const StyledCard = styled(Card)(() => ({
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '30px',
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: '10px',
  backgroundColor: '#14213d',
}));

const HistoryIntroCard = () => {
  return (
    <StyledCard variant='outlined'>
      {/* <ThemeProvider theme={theme}> */}
      <Typography color='#E5E5E5' variant='h2'>
        Welcome to the history page!
      </Typography>
      <Typography color='white' variant='h4'>
        Take a look at your past attempts and see how you did.
      </Typography>
      {/* </ThemeProvider> */}
    </StyledCard>
  );
};

export default HistoryIntroCard;
