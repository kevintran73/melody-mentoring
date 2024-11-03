import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import defaultImg from '../../assets/default-img.png';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const PlaylistCard = ({ title, artist, difficulty }) => {
  return (
    <Paper
      sx={(theme) => ({
        border: '0.1px solid grey',
        padding: 1,
        marginY: '10px',
        width: '90%',
        flexGrow: 1,
        backgroundColor: '#fff',
        ...theme.applyStyles('dark', {
          backgroundColor: '#1A2027',
        }),
      })}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 64, height: 64 }}>
            <Img alt='playlist-card' src={defaultImg} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction='column'>
            <Grid item xs>
              <Typography gutterBottom variant='subtitle1' component='div'>
                {title}
              </Typography>
              <Typography variant='body2' gutterBottom>
                {artist} • {difficulty}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PlaylistCard;
