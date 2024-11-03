import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const TutorInfoCard = ({ img, name, details }) => {
  return (
    <Box
      sx={{
        border: '0.1px solid grey',
        padding: 1,
        marginY: '10px',
        width: '100%',
        flexGrow: 1,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '16px',
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 64, height: 64 }}>
            <Img alt='playlist-card' src={img} />
          </ButtonBase>
        </Grid>

        {/* Name & Details */}
        <Grid item xs={12} sm container>
          <Grid item xs container direction='column'>
            <Grid item xs>
              <Typography gutterBottom variant='subtitle1' component='div'>
                {name}
              </Typography>
              <Typography variant='body2' gutterBottom>
                {details}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TutorInfoCard;
