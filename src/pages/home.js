import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  container: {
    marginTop: 50
  },
  grid: {
    textAlign: 'center'
  },
  link: {
    textDecoration: 'none'
  }
});

function Home(props) {
  const { classes } = props;
  return (
    <main className={classes.layout}>
      <div className={classes.heroContent}>
        <Grid container spacing={32} justify="space-evenly">
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Split the bill
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            This bill splitting application has been built to support my final year dissertation.
          </Typography>
        </Grid>
        <Grid container spacing={32} justify="space-evenly" className={classes.container}>
          <Grid item xs className={classes.grid}>
            <Link to="/create" className={classes.link}>
              <Button variant="outlined" >Create</Button>
            </Link>
          </Grid>
          <Grid item xs className={classes.grid}>
            <Link to="/join" className={classes.link}>
              <Button variant="outlined" >Join</Button>
            </Link>
          </Grid>
        </Grid>
      </div>
    </main>
  );
}

export default withStyles(styles)(Home);