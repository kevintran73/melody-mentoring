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

const LoginForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  padding: '30px 40px',
  width: 'calc(100vw - 1000px)',
  height: 'calc(100vh - 100px)',
  border: '1px solid #D9D9D9',
  borderRadius: '1rem',

  '@media (max-width: 1500px)': {
    width: '600px',
  },

  '@media (max-width: 1000px)': {
    width: '500px',
  },

  '@media (max-width: 550px)': {
    width: '400px',
  },

  '@media (max-width: 450px)': {
    width: '320px',
    padding: '15px 20px',
  },
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
 * Login sub-page
 */
const LoginSub = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login } = React.useContext(TokenContext);
  const navigate = useNavigate();

  // Handles the login
  const handleLogin = async (event) => {
    // Prevent page from refreshing
    event.preventDefault();

    // check all fields are filled
    if (email === '' || password === '') {
      showErrorMessage('Please fill in all fields');
    } else {
      try {
        const response = await axios.post('http://localhost:5001/auth/login', {
          email: email,
          password: password,
        });
        // stores tokens inside variables using TokenContext's login
        const { access_token, id_token, refresh_token, user_id } = response.data;
        login(access_token, id_token, refresh_token, user_id);

        navigate('/catalogue'); // redirect to catalogue page
      } catch (err) {
        showErrorMessage(err.response.data.error);
      }
    }
  };

  // Handle login if enter key is pressed
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin(event);
    }
  };

  return (
    <StyledContainer>
      <LoginForm onSubmit={handleLogin} onKeyDown={handleKeyDown} noValidate>
        <StyledHeader>Sign In</StyledHeader>
        <StyledTextField
          type='email'
          label='Email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          id='login-email'
          required
        />
        <StyledTextField
          type='password'
          label='Password'
          onChange={(p) => setPassword(p.target.value)}
          value={password}
          id='login-password'
          required
        />
        <StyledButton variant='contained' type='submit' id='login-go'>
          Log in
        </StyledButton>
        <Link className='underline' to='/register'>
          Don't have an account?
        </Link>
      </LoginForm>
    </StyledContainer>
  );
};

export default LoginSub;
