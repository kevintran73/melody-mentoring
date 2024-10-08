import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TokenContext from './context/TokenContext';

import Login from './pages/Login';
import LoginSub from './pages/LoginSub';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import Notifications from './pages/Notifications';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import Create from './pages/Create';
import Uploads from './pages/Uploads';
import Playlist from './pages/Playlist';

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
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/login-sub' element={<LoginSub />} />

          <Route path='/notifications' element={<Notifications />} />
          <Route path='/create' element={<Create />} />
          <Route path='/catalogue' element={<Catalogue />} />
          <Route path='/uploads' element={<Uploads />} />
          <Route path='/activity' element={<Activity />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/playlist' element={<Playlist />} />
        </Routes>
      </BrowserRouter>
    </TokenContext.Provider>
  );
};

export default App;
