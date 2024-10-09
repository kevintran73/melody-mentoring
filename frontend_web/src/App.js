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
import Verification from './pages/Verification';

const App = () => {

  const [accessToken, setAccessToken] = React.useState(null);
  const [idToken, setIdToken] = React.useState(null);
  const [refreshToken, setRefreshToken] = React.useState(null);

  // at login, set and store tokens 
  const login = (accessToken, idToken, refreshToken) => {
    setAccessToken(accessToken)
    setIdToken(idToken)
    setRefreshToken(refreshToken)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // at logout, set all tokens to null
  const logout = () => {
    setAccessToken(null)
    setIdToken(null)
    setRefreshToken(null)
    localStorage.remove('accessToken')
    localStorage.remove('idToken')
    localStorage.remove('refreshToken')
  }

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
          <Route path='/activity' element={<Activity />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/playlist' element={<Playlist />} />
        </Routes>
      </BrowserRouter>
    </TokenContext.Provider>
  );
};

export default App;
