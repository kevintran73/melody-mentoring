import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import defaultImg from '../../assets/default-img.png';
import Typography from '@mui/material/Typography';
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
        // height: '10vw',
        objectFit: 'cover',
        padding: '10px',
      }}
    />
  )
}

const AchievementSection = ({ img, value, minValue, maxValue, name }) => {
  return (
    <Box 
      sx={{
        width: '13vw',
        // height: '10vw',
        objectFit: 'cover',
        padding: '10px',
        textAlign: 'center', 
        border: 'solid black', 
        margin: '10px',
      }}  
    >
      <Image img={img} />
      {/* If string, show string. Otherwise show a progress bar using value var. */}
      {typeof value === 'string' ? (
        <Typography variant="body2"> {value} </Typography>
      ) : (
        <Progress value={value} minValue={minValue} maxValue={maxValue} />
      )}
      <Typography>{name}</Typography>
    </Box>
  )
}

const AchievementGrid = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Box
        display='flex'
        flexDirection='column'
        spacing={2}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          // flexWrap: 'nowrap',
        }}
      >

        {/* Top layer */}
        <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
          <AchievementSection img={defaultImg} value='20 days' minValue='0' maxValue='100' name='Test' />
          <AchievementSection img={defaultImg} value={10} minValue='0' maxValue='100' name='Total Attempts' />
          <AchievementSection img={defaultImg} value={30} minValue='0' maxValue='100' name='Excellent Lessons' />
        </Box>

        {/* Bottom layer */}
        <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
          <AchievementSection img={defaultImg} value={40} minValue='0' maxValue='100' name='Test' />
          <AchievementSection img={defaultImg} value={60} minValue='0' maxValue='100' name='Test' />
        </Box>
      </Box>
    </Box>
  );
}

export default AchievementGrid;
