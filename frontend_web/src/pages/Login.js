import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import loginImage from '../assets/default-img.png';

import TokenContext from '../context/TokenContext';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ImgRight = styled('img')({
  marginTop: '5vh',
  marginRight: '6vw',
  width: '40vw',
  height: 'auto',
  borderRadius: '10%',
});

const LoginForm = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  marginLeft: '6vw',
  height: '90vh',
  width: '40vw',
  alignItems: 'center',

  // '@media (max-width: 950px)': {
  //   paddingLeft: '20%',
  //   paddingRight: '20%',
  //   width: '60%',
  // },
});

const StyledHeading1 = styled('h1')({
  fontSize: '3rem',
  marginBottom: '0',
});

const StyledHeading2 = styled('h2')({
  fontSize: '2rem',
  marginTop: '2px',
  marginBottom: '25px',
});

const StyledHeading3 = styled('h3')({
  fontSize: '1.8rem',
  marginTop: '10px',
  marginBottom: '25px',
});

const StyledButton = styled(Button)({
  width: '30%',
  backgroundColor: '#2C2C2C',
  fontSize: '1.2rem',
  padding: '8px 100px',
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
  const { token } = React.useContext(TokenContext);
  const navigate = useNavigate();

  // Navigate to dashboard if active token
  if (token !== null) {
    return <Navigate to='/dashboard' />;
  }

  const navRegister = () => {
    return navigate('/register');
  };

  const navLogin = () => {
    return navigate('/login');
  };

  return (
    <StyledContainer>
      <LoginForm>
        <StyledHeading1>Melody Mentoring</StyledHeading1>
        <StyledHeading2>Catchy Slogan</StyledHeading2>
        <StyledButton variant='contained' type='button' id='nav-login-main' onClick={navLogin}>
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
      </LoginForm>
      <ImgRight id='login-img' src={loginImage} />
    </StyledContainer>
  );
};

export default Login;
