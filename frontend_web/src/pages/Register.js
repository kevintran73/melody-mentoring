import React from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { showErrorMessage } from '../helpers';

import TokenContext from '../context/TokenContext';
import { Button, TextField } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
});

const StyledHeader = styled('h1')({
  marginTop: '0',
  marginBottom: '0',
  fontSize: '3rem',
});

const RegisterForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  paddingTop: '5vh',
  paddingLeft: '3vw',
  paddingRight: '3vw',
  paddingBottom: '5vh',
  width: '40vw',
  height: '75vh',
  border: '1px solid #D9D9D9',
  borderRadius: '1rem',

  //   '@media (max-width: 950px)': {
  //     paddingLeft: '20%',
  //     paddingRight: '20%',
  //     width: '60%',
  //   },
});

const StyledTextField = styled(TextField)({
  width: '100%',
});

const StyledButton = styled(Button)({
  backgroundColor: '#2C2C2C',
  width: '100%',
  height: '3rem',
  fontSize: '1.1rem',
});

/**
 * Register page
 */
const Register = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { token, setTokenLocalStorage } = React.useContext(TokenContext);
  const navigate = useNavigate();

  // Navigate to dashboard if active token
  if (token !== null) {
    return <Navigate to='/dashboard' />;
  }

  // Handles the login
  const register = async (event) => {
    // Prevent page from refreshing
    event.preventDefault();

    try {
      // const response = await axios.post('http://localhost:5005/admin/auth/register', {
      //   email,
      //   password,
      // });

      // Set the token and navigate to dashboard
      // setTokenLocalStorage(response.data.token);
      return navigate('/dashboard');
    } catch (err) {
      showErrorMessage(err.response.data.error);
    }
  };

  // Handle login if enter key is pressed
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      register(event);
    }
  };

  return (
    <StyledContainer>
      <RegisterForm onSubmit={register} onKeyDown={handleKeyDown} noValidate>
        <StyledHeader>Sign Up</StyledHeader>
        <StyledTextField
          type='email'
          label='Email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          id='register-email'
          required
        />
        <StyledTextField
          type='password'
          label='Password'
          onChange={(p) => setPassword(p.target.value)}
          value={password}
          id='register-password'
          required
        />
        <StyledButton variant='contained' type='submit' id='register-go'>
          Sign up
        </StyledButton>
      </RegisterForm>
    </StyledContainer>
  );
};

export default Register;
