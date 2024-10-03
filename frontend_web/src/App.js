import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TokenContext from './context/TokenContext';
import Login from './pages/Login';

const App = () => {
  // Get the token from localStorage if it exists, otherwise null
  let lsToken = null;
  if (localStorage.getItem('token') !== 'null') {
    lsToken = localStorage.getItem('token');
  }
  const [token, setToken] = React.useState(lsToken);

  const setTokenLocalStorage = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  return (
    <TokenContext.Provider value={{ token, setTokenLocalStorage }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          {/* <Route path='/register' element={<Register />} /> */}
          <Route path='/login' element={<Login />} />
          {/* <Route path='/dashboard' element={<Dashboard />} /> */}
        </Routes>
      </BrowserRouter>
    </TokenContext.Provider>
  );
};

export default App;
