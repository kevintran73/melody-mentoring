import React from 'react';
// import { useNavigate, Navigate, Link } from 'react-router-dom';

// import TokenContext from '../context/TokenContext';
import NavBar from '../components/NavBar';

/**
 * Catalogue/songs page
 */
const Catalogue = () => {
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

export default Catalogue;
