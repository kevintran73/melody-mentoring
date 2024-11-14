import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { showErrorMessage } from '../helpers';

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

  '@media (max-height: 650px)': {
    gap: '25px',
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
 * Register page
 */
const Register = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  // Handles the signup
  const register = async (event) => {
    // Prevent page from refreshing
    event.preventDefault();

    const role = isChecked ? 'tutor' : 'student';

    // check all fields are filled
    if (username === '' || email === '' || password === '') {
      showErrorMessage('Please fill in all fields');
    } else {
      try {
        await axios.post('http://localhost:5001/auth/signup', {
          username: username,
          email: email,
          password: password,
          role: role,
        });

        navigate('/verification', { state: { username: username, role: role } }); // if signup is succesful, redirct to email verification page
      } catch (err) {
        showErrorMessage(err.response.data.error);
      }
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
          type='text'
          label='Username'
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          id='register-username'
          required
        />
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

        <div>
          <label>Are you a tutor? </label>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
        </div>

        <StyledButton variant='contained' type='submit' id='register-go'>
          Sign up
        </StyledButton>
        <Link className='underline' to='/login-sub'>
          Already have an account?
        </Link>
      </RegisterForm>
    </StyledContainer>
  );
};

export default Register;
