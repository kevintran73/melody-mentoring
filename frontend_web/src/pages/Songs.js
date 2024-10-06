import React from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';

import TokenContext from '../context/TokenContext';
import NavBar from '../components/NavBar';

/**
 * Songs page
 */
const Songs = () => {
  //   const { token } = React.useContext(TokenContext);
  //   if (token === null) {
  //     return <Navigate to='/login' />;
  //   }

  return (
    <>
      <NavBar></NavBar>
    </>
  );
};

export default Songs;
