import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import defaultImg from '../../assets/default-img.png';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  width: '60px',
  maxWidth: '100%',
  maxHeight: '100%',
});

const PlaylistCard = ({ title, composer, difficulty, thumbnail, onClick }) => {
  return (
    <Paper
      onClick={onClick}
      sx={(theme) => ({
        border: '0.1px solid grey',
        cursor: 'pointer',
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
          <Img src={thumbnail ? thumbnail : defaultImg} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction='column'>
            <Grid item xs>
              <Typography gutterBottom variant='subtitle1' component='div'>
                {title}
              </Typography>
              <Typography variant='body2' gutterBottom>
                {composer} • Difficulty: {difficulty}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PlaylistCard;
