import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import loginImage from '../assets/piano.jpg';

import TokenContext from '../context/TokenContext';
import { Button } from '@mui/material';
import { styled, useMediaQuery } from '@mui/system';

const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100vh',
  padding: '0 6vw',

  '@media (max-width: 700px)': {
    flexDirection: 'column',
  },
});

const ImgContainer = styled('div')({
  width: '40vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const LeftContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  height: '100vh',
  width: '40vw',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (max-width: 750px)': {
    width: '80vw',
  },
});

const ImgRight = styled('img')({
  width: '100%',
  height: '100%',
  borderRadius: '10%',
});

const StyledHeading1 = styled('h1')({
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '0',
  marginTop: '0',
  textAlign: 'center',
});

const StyledHeading2 = styled('h2')({
  fontSize: '2rem',
  marginTop: '2px',
  marginBottom: '25px',
  textAlign: 'center',
});

const StyledHeading3 = styled('h3')({
  fontSize: '1.8rem',
  marginTop: '10px',
  marginBottom: '25px',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  width: '30%',
  backgroundColor: '#2C2C2C',
  fontSize: '1.2rem',
  padding: '8px 100px',

  '&:hover': {
    backgroundColor: '#3D3D3D',
  },
});

const StyledDivider = styled('div')({
  height: '1px',
  width: '90%',
  backgroundColor: '#000000',
  marginTop: '30px',
});

/**
 * Login page
 */
const Login = () => {
  const { accessToken } = React.useContext(TokenContext);
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery('(max-width: 750px)');

  // Navigate to default page if active token
  if (accessToken !== null) {
    return <Navigate to='/catalogue' />;
  }

  const navRegister = () => {
    return navigate('/register');
  };

  const navLogin = () => {
    return navigate('/login-sub');
  };

  return (
    <StyledContainer>
      <LeftContainer>
        <StyledHeading1>Melody Mentoring</StyledHeading1>
        <StyledHeading2>Discover the Musician in You</StyledHeading2>
        <StyledButton
          variant='contained'
          type='button'
          id='nav-login-main'
          onClick={navLogin}
        >
          Login
        </StyledButton>
        <StyledDivider />
        <StyledHeading3>Don't have an account?</StyledHeading3>
        <StyledButton
          variant='contained'
          type='button'
          id='nav-register-main'
          onClick={navRegister}
        >
          Register
        </StyledButton>
      </LeftContainer>

      {!isSmallScreen && (
        <ImgContainer>
          <ImgRight id='login-img' src={loginImage} />
        </ImgContainer>
      )}
    </StyledContainer>
  );
};

export default Login;
