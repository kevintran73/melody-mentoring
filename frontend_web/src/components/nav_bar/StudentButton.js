import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { styled } from '@mui/system';

const IconContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledMusic = styled(RateReviewIcon)(({ colour }) => ({
  color: colour,
  width: '32px',
  height: '32px',
}));

const IconCaption = styled('p')(({ colour }) => ({
  fontSize: '0.75rem',
  color: colour,
  margin: '0',
}));

const StudentsButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Change colour of button if on dashboard page
  let colour = '#B6B6B6';
  if (location.pathname === '/dashboard') {
    colour = '#FFFFFF';
  }
  const navCatalogue = () => {
    return navigate('/dashboard');
  };
  return (
    <IconContainer onClick={navCatalogue} data-cy='review-button'>
      <StyledMusic colour={colour} />
      <IconCaption colour={colour}>Review</IconCaption>
    </IconContainer>
  );
};
export default StudentsButton;
