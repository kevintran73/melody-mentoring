import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import defaultImg from '../../assets/default-img.png';
import { Grid2 } from '@mui/material';

const HistoryCard = ({ title, artist, difficulty, date }) => {
  return (
    <Paper
      sx={{
        border: '0.1px solid grey',
        padding: 1,
        // marginY: '10px',
        // marginX: '10vw',
        width: '100%',
        flexGrow: 1,
        backgroundColor: '#fff',
      }}
    >
      <Grid2 container spacing={2}>
        <Grid2 item>
          <ButtonBase sx={{ width: 64, height: 64 }}>
            <img alt='playlist-card' src={defaultImg} />
          </ButtonBase>
        </Grid2>
        <Grid2 item xs={12} sm container>
          <Grid2 item xs container direction='column'>
            <Grid2 item xs>
              <Typography gutterBottom variant='subtitle1' component='div'>
                {title}
              </Typography>
              <Typography variant='body2' gutterBottom>
                {artist} • {difficulty}
              </Typography>
              <Typography variant='body2' gutterBottom>
                {date}
              </Typography>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Paper>
  );
}

export default HistoryCard;
