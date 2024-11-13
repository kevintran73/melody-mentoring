import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TokenContext from './context/TokenContext';

import Login from './pages/Login';
import LoginSub from './pages/LoginSub';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Create from './pages/Create';
import History from './pages/History';
import Playlist from './pages/Playlist';
import Verification from './pages/Verification';
import Experiment from './pages/Experiment';
import Review from './pages/Review';
import TrackSummary from './pages/TrackSummary';
import Dashboard from './pages/Dashboard';
import Request from './pages/Request';

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

  let lsUserId = null;
  if (localStorage.getItem('userId') !== 'null') {
    lsUserId = localStorage.getItem('userId');
  }
  const [userId, setUserId] = React.useState(lsUserId);

  let lsRole = null;
  if (localStorage.getItem('role') !== 'null') {
    lsRole = localStorage.getItem('role');
  }
  const [role, setRole] = React.useState(lsRole);

  // at login, set and store tokens
  const login = (accessToken, idToken, refreshToken, userId, role) => {
    setAccessToken(accessToken);
    setIdToken(idToken);
    setRefreshToken(refreshToken);
    setUserId(userId);
    setRole(role)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
  };

  // at logout, set all tokens to null
  const logout = () => {
    setAccessToken(null);
    setIdToken(null);
    setRefreshToken(null);
    setUserId(userId);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  };

  return (
    <TokenContext.Provider value={{ accessToken, idToken, refreshToken, userId, role, login, logout }}>
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
          <Route path='/history' element={<History />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/track-summary/:trackAttemptId' element={<TrackSummary />} />
          <Route path='/experiment/:songId' element={<Experiment />} />
          <Route path='/review/:trackAttemptId' element={<Review />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/students' element={<Request />} />
        </Routes>
      </BrowserRouter>
    </TokenContext.Provider>
  );
};

export default App;
