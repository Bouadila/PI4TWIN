import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import parse from 'html-react-parser';
import './Training.css';
// material
import { Button, Container, Stack, Typography, Divider, Card, Grid } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import openSocket from 'socket.io-client';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Training() {
  const user = useSelector((state) => state.user);
  const [training, setTraining] = useState([]);
  const socket = openSocket('http://localhost:8000');
  useEffect(() => {
    axios.get(`http://localhost:8081/api/trainings/user/${user.id}`).then((response) => {
      setTraining(response.data);
      // console.log(response.data);
    });
    socket.on('refresh', () => {
      axios.get(`http://localhost:8081/api/trainings/user/${user.id}`).then((response) => {
        setTraining(response.data);
        // console.log(response.data);
      });
    });
  }, []);
  const [pageNumber, setPageNumber] = useState(0);

  const trainingsPerPage = 8;
  const pagesVisited = pageNumber * trainingsPerPage;
  const displayTrainings = training
    .slice(pagesVisited, pagesVisited + trainingsPerPage)
    .map((training) => {
      return (
        <Grid key={training._id} item xs={12} sm={6} md={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image={`http://localhost:8081/${training.image}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" noWrap>
                {training.name}
              </Typography>
              <Divider variant="middle" />
              <Typography variant="body2" color="text.secondary" component="div" noWrap>
                Created by{' '}
                <b>
                  {' '}
                  {user.firstName} {user.lastName}
                </b>
              </Typography>
              {/* <Typography variant="body2" color="text.secondary" component="div" noWrap>
                {parse(training.description)}
              </Typography> */}
            </CardContent>
            <Divider variant="middle" />
            <CardActions style={{ justifyContent: 'center' }}>
              <Button size="small" component={RouterLink} to={`/training/details/${training._id}`}>
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });
  const pageCount = Math.ceil(training.length / trainingsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <Page title="Dashboard: Training | Learnigo">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Training
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/training/new"
            startIcon={<Iconify icon="bx:add-to-queue" />}
          >
            New Training
          </Button>
        </Stack>
      </Container>
      <Grid container spacing={3}>
        {displayTrainings}
      </Grid>
      <br />
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'paginationBttns'}
        previousLinkClassName={'previousBttn'}
        nextLinkClassName={'nextBttn'}
        disabledClassName={'paginationDisabled'}
        activeClassName={'paginationActive'}
      />
    </Page>
  );
}
