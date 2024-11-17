import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import bronzeImage from '../../assets/ranks_0000_bronze.png';
import silverImage from '../../assets/ranks_0001_silver.png';
import goldImage from '../../assets/ranks_0002_gold.png';
import diamondImage from '../../assets/ranks_0003_diamond.png';

const Progress = ({ value, minValue, maxValue }) => {
  const percentage = ((value - minValue) / (maxValue - minValue)) * 100;

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <Typography variant='body2' sx={{ marginRight: 2 }}>
        {minValue}
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress variant='determinate' value={percentage} />
      </Box>

      <Typography variant='body2' sx={{ marginLeft: 2 }}>
        {maxValue}
      </Typography>
    </Box>
  );
};

const Image = ({ img }) => {
  return (
    <Box
      component='img'
      src={img}
      alt='test'
      sx={{
        width: '7vw',
        padding: '10px',

        '@media (max-width: 1000px)': {
          width: '10vw',
        },
      }}
    />
  );
};

function checkRank(userInfo, easyDone, mediumDone, hardDone) {
  const rankInfo = {
    name: 'bronze',
    easyMin: 0,
    easyMax: 3,
    mediumMin: 0,
    mediumMax: 0,
    hardMin: 0,
    hardMax: 0,
  };

  for (const achievement of userInfo['achievements']) {
    if (
      easyDone >= achievement['easy_required'] &&
      mediumDone >= achievement['medium_required'] &&
      hardDone >= achievement['hard_required']
    ) {
      rankInfo['name'] = achievement['name'];
      rankInfo['easyMin'] = achievement['easy_required'];
      rankInfo['mediumMin'] = achievement['medium_required'];
      rankInfo['hardMin'] = achievement['hard_required'];
    } else {
      rankInfo['easyMax'] = achievement['easy_required'];
      rankInfo['mediumMax'] = achievement['medium_required'];
      rankInfo['hardMax'] = achievement['hard_required'];
      break;
    }
  }
  console.log(rankInfo);

  return rankInfo;
}

const RankIcons = ({ rankInfo }) => {
  const rankImages = {
    bronze: bronzeImage,
    silver: silverImage,
    gold: goldImage,
    diamond: diamondImage,
  };

  const currentRank = rankInfo['name'];
  const getNextRank = (rank) => {
    if (rank === 'bronze') {
      return 'silver';
    } else if (rank === 'silver') {
      return 'gold';
    } else if (rank === 'gold') {
      return 'diamond';
    } else {
      return null;
    }
  };
  const nextRank = getNextRank(rankInfo['name']);

  return (
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='center'
      alignItems='center'
      gap='10px'
    >
      {rankImages[currentRank] && <Image img={rankImages[currentRank]} />}
      <ArrowForwardIcon sx={{ fontSize: '60px' }}></ArrowForwardIcon>
      {rankImages[nextRank] && <Image img={rankImages[nextRank]} />}
    </Box>
  );
};

const AchievementGrid = ({ userInfo }) => {
  console.log(userInfo);
  const easyDone = userInfo['easy_completed'].length
    ? userInfo['easy_completed'].length
    : 0;
  const mediumDone = userInfo['medium_completed'].length
    ? userInfo['medium_completed']
    : 0;
  const hardDone = userInfo['hard_completed'].length
    ? userInfo['hard_completed'].length
    : 0;
  const rankInfo = checkRank(userInfo, easyDone, mediumDone, hardDone);

  return (
    <Box
      display='flex'
      flexDirection='column'
      width='100%'
      height='100%'
      padding='10px'
      textAlign='center'
      alignItems='center'
      justifyContent='center'
      boxShadow={3}
      borderRadius='16px'
      margin='10px'
    >
      <RankIcons rankInfo={rankInfo}></RankIcons>
      <Box margin='0px 10px 10px 10px' width='90%'>
        <Typography
          sx={{
            fontSize: '1.3rem',
            '@media (max-width: 1000px)': {
              fontSize: '2vw',
            },
          }}
        >
          Easy Attempts
        </Typography>
        <Progress
          value={rankInfo['easyMin']}
          minValue={0}
          maxValue={rankInfo['easyMax']}
        />
      </Box>

      {rankInfo['mediumMax'] > 0 && (
        <Box margin='0px 10px 10px 10px' width='90%'>
          <Typography
            sx={{
              fontSize: '1.3rem',
              '@media (max-width: 1000px)': {
                fontSize: '2vw',
              },
            }}
          >
            Medium Attempts
          </Typography>
          <Progress
            value={rankInfo['mediumMin']}
            minValue={0}
            maxValue={rankInfo['mediumMax']}
          />
        </Box>
      )}

      {rankInfo['hardMax'] > 0 && (
        <Box margin='0px 10px 10px 10px' width='90%'>
          <Typography
            sx={{
              fontSize: '1.3rem',
              '@media (max-width: 1000px)': {
                fontSize: '2vw',
              },
            }}
          >
            Hard Attempts
          </Typography>
          <Progress
            value={rankInfo['hardMin']}
            minValue={0}
            maxValue={rankInfo['hardMax']}
          />
        </Box>
      )}
    </Box>
  );
};

export default AchievementGrid;
