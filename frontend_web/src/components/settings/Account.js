import React from 'react';

import TokenContext from '../../context/TokenContext';
import { showErrorMessage } from '../../helpers';
import axios from 'axios';

import { styled } from '@mui/system';
import LogoutIcon from '@mui/icons-material/Logout';

const HeaderBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const SectionHeader = styled('h2')({
  fontSize: '1.25rem',
  fontWeight: 'bold',
});

const SectionDesc = styled('p')({
  fontSize: '1rem',
  color: '#2b2b2b',
  width: 'auto',
  whiteSpace: 'nowrap',
});

const SectionBlock = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '40px',
});

const DividerLine = styled('hr')({
  border: 'none',
  borderTop: '1px solid #9c9c9c',
  width: 'auto',
  margin: '25px 0',
});

const StyledLogoutButton = styled(LogoutIcon)({
  color: '#3b3b3b',
  height: '30px',
  width: '30px',
  cursor: 'pointer',

  '&:hover': {
    color: '#369ce0',
  },
});

/**
 * Account settings block
 */
const Account = () => {
  const { accessToken, logout } = React.useContext(TokenContext);

  const handleLogout = async (event) => {
    try {
      const response = axios.post('http://localhost:5001/auth/logout', {
        access_token: accessToken,
      });

      logout();
    } catch (err) {
      showErrorMessage(err.response.data.error);
    }
  };

  return (
    <>
      <HeaderBlock>
        <SectionHeader>Account</SectionHeader>
        <SectionDesc>Manage your account information and update personal details</SectionDesc>
      </HeaderBlock>

      <DividerLine />

      <SectionBlock>
        <HeaderBlock>
          <SectionHeader>Sign out</SectionHeader>
          <SectionDesc>Sign out for this browser</SectionDesc>
        </HeaderBlock>
        <StyledLogoutButton onClick={handleLogout} />
      </SectionBlock>

      <DividerLine />
    </>
  );
};

export default Account;
