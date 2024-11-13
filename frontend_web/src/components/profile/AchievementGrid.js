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

function checkRank(userInfo, easyDone, mediumDone, hardDone) {
  const rankInfo = {
    name: '',
    easyMin: 0,
    easyMax: 3,
    mediumMin: 0,
    mediumMax: 0,
    hardMin: 0,
    hardMax:0,
  }

  userInfo['achievements'].forEach(achievement => {
      if (
        easyDone >= achievement['easy_required'] &&
        mediumDone >= achievement['medium_required'] &&
        hardDone >= achievement['hard_required']
      ) {
          rankInfo['name'] = achievement['name']
          rankInfo['easyMin'] = achievement['easy_required']
          rankInfo['mediumMin'] = achievement['medium_required']
          rankInfo['hardMin'] = achievement['hard_required']
      } else {
        rankInfo['easyMax'] = achievement['easy_required']
        rankInfo['mediumMax'] = achievement['medium_required']
        rankInfo['hardMax'] = achievement['hard_required']
      }
  });

  return rankInfo;
}


const AchievementGrid = ({ userInfo }) => {
  // const easyDone = userInfo['easy_completed'].length ? userInfo['easy_completed'].length : 0;
  // const mediumDone = userInfo['medium_completed'].length ? userInfo['medium_completed'] : 0;
  // const hardDone = userInfo['hard_completed'].length ? userInfo['hard_completed'].length : 0;
  // const rankInfo = checkRank(userInfo, easyDone, mediumDone, hardDone)

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
            {/* <Progress value={rankInfo['easyMin']} minValue={0} maxValue={rankInfo['easyMax']} />
            <Progress value={rankInfo['mediumMin']} minValue={0} maxValue={rankInfo['mediumMax']} />
            <Progress value={rankInfo['hardMin']} minValue={0} maxValue={rankInfo['hardMax']} /> */}
          <Typography>{'Test'}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default AchievementGrid;
