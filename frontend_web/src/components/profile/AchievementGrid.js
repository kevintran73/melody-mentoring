import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import defaultImg from '../../assets/default-img.png';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LinearProgress from '@mui/material/LinearProgress';

const Progress = ({ value, minValue, maxValue }) => {
  const percentage = ((value - minValue) / (maxValue - minValue)) * 100;

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2" sx={{ marginRight: 2 }}>
        {minValue}
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress variant="determinate" value={percentage} />
      </Box>

      <Typography variant="body2" sx={{ marginLeft: 2 }}>
        {maxValue}
      </Typography>
    </Box>
  )
}

const Image = ({ img }) => {
  return (
    <Box
      component="img"
      src={img}
      alt='test'
      sx={{
        width: '100%',
        objectFit: 'cover',
        padding: '10px',
      }}
    />
  )
}

const AchievementGrid = ({ achievements, easyDone, MediumDone, HardDone }) => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Box
        display='flex'
        flexDirection='column'
        spacing={2}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box 
          sx={{
            width: '13vw',
            objectFit: 'cover',
            padding: '10px',
            textAlign: 'center', 
            boxShadow: 3,
            borderRadius: '16px',
            margin: '10px',
          }}  
        >

          <Box>
            <ArrowForwardIcon width='100px'></ArrowForwardIcon>
          </Box>


          {/* <Image img={img} /> */}
          {/* If string, show string. Otherwise show a progress bar using value var. */}
            <Progress value={1} minValue={0} maxValue={4} />
            <Progress value={1} minValue={0} maxValue={4} />
            <Progress value={1} minValue={0} maxValue={4} />
          <Typography>{'Test'}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default AchievementGrid;
