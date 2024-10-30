import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Popup from '../components/Popup';
import { showErrorMessage } from '../helpers';

const Verification = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state === null) {
      navigate('/register');
    } else {
      setUsername(location.state.username);
    }
  }, []);

  const handleResend = async () => {
    try {
      await axios.post(`http://localhost:5001/auth/resend-confirmation`, {
        username: username,
      });
      setOpen(true); // open popup
      setMessage('New code has been sent');
    } catch (error) {
      showErrorMessage(error.response.data.error);
    }
  };

  const handleConfirmation = async () => {
    try {
      await axios.post(`http://localhost:5001/auth/confirm-signup`, {
        code: code,
        username: username,
      });

      // if confirmation is successful, redirect to login page for user to login with their credentials
      setOpen(true);
      setMessage('Your email has been verified');
      navigate('/login-sub');
    } catch (error) {
      showErrorMessage(error.response.data.error);
    }
  };

  return (
    <div className=' h-screen flex justify-center items-center'>
      <div className='w-[50%] flex flex-col'>
        <h1 className='font-bold text-3xl text-center'>Verify your email address</h1>
        <p className='my-2'>Check your email inbox for a 6-digit code</p>

        <div className='my-8'>
          <p className='font-bold'>Enter your 6-digit code</p>
          <input
            className='w-full border rounded-md px-3 py-2'
            placeholder='Enter code'
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <p className='my-8'>
          Didn't receive an email?{' '}
          <span onClick={handleResend} className='underline text-blue-600 hover:cursor-pointer'>
            Send a new code
          </span>
        </p>
        <button
          onClick={handleConfirmation}
          className='bg-[#2c2c2c] text-white mx-auto px-10 py-2 rounded-lg'
        >
          Verify
        </button>

        <Popup open={open} setOpen={setOpen} content={message} />
      </div>
    </div>
  );
};

export default Verification;
