import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TokenContext from './context/TokenContext';

import Login from './pages/Login';
import LoginSub from './pages/LoginSub';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import Notifications from './pages/Notifications';
import Summary from './pages/Summary';
import Settings from './pages/Settings';
import Create from './pages/Create';
import Uploads from './pages/Uploads';
import Playlist from './pages/Playlist';
import Verification from './pages/Verification';
import Experiment from './pages/Experiment';

const App = () => {
  let lsAccessToken = null;
  if (localStorage.getItem('accessToken') !== 'null') {
    lsAccessToken = localStorage.getItem('accessToken');
  }
  const [accessToken, setAccessToken] = React.useState(lsAccessToken);

  let lsIdToken = null;
  if (localStorage.getItem('idToken') !== 'null') {
    lsIdToken = localStorage.getItem('idToken');
  }
  const [idToken, setIdToken] = React.useState(lsIdToken);

  let lsRefreshToken = null;
  if (localStorage.getItem('refreshToken') !== 'null') {
    lsRefreshToken = localStorage.getItem('refreshToken');
  }
  const [refreshToken, setRefreshToken] = React.useState(lsRefreshToken);

  // at login, set and store tokens
  const login = (accessToken, idToken, refreshToken) => {
    setAccessToken(accessToken);
    setIdToken(idToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  // at logout, set all tokens to null
  const logout = () => {
    setAccessToken(null);
    setIdToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <TokenContext.Provider value={{ accessToken, idToken, refreshToken, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/login-sub' element={<LoginSub />} />
          <Route path='/verification' element={<Verification />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/create' element={<Create />} />
          <Route path='/catalogue' element={<Catalogue />} />
          <Route path='/uploads' element={<Uploads />} />
          <Route path='/summary' element={<Summary />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/experiment/:songId' element={<Experiment />} />
        </Routes>
      </BrowserRouter>
    </TokenContext.Provider>
  );
};

export default App;
