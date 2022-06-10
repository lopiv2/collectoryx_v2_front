import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import { FormattedMessage } from 'react-intl';
import { Box } from "@mui/material";
import { Grid } from '@mui/material';
import { Button } from '@mui/material';
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardActions, CardMedia } from '@mui/material';
import styles from "../styles/Collections.css"
import BorderLinearProgressBar from "../components/BorderLinearProgressBar"
import { useLocation } from 'react-router-dom';

function DisplayCollection(props) {

  const [collectionsList, setCollectionsList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const collections = ConfigService.getCollectionLists().then((response) => {
      setCollectionsList(response.data);
      //console.log(collectionsList);
    })
      .catch(err => {
        console.log(err);
      });
    console.log(location);
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer autoClose={2000} />
      <Grid>
        <Grid item xs={6}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.view_collections_title"></FormattedMessage>
          </Typography>
        </Grid>
        <Grid container spacing={collectionsList.length} className="container" pt={3}>
          {collectionsList.map((item, id) => (
            <Grid item key={id}>
              <Card sx={{ height: 400, minWidth: 250, maxWidth: 250, boxShadow: 5 }} ml={200}>
                <CardContent>
                  {item.logo ? null : <Typography align="center" sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
                    {item.name}
                  </Typography>}
                  <Typography variant="h5" component="div">
                  </Typography>
                  <CardMedia
                    component="img"
                    width='100%'
                    image={require('../../../images/' + item.logo.path)}
                    alt={item.name}
                    className="card-collection"
                    style={styles}
                  />
                  <Typography align="center" sx={{ mb: .5 }} mt={1} color="text.secondary">
                    */* <FormattedMessage id="app.collection.items"></FormattedMessage>
                  </Typography>
                  <BorderLinearProgressBar variant="determinate" value={50}>
                    0%
                  </BorderLinearProgressBar>
                </CardContent>
                <CardActions style={{ justifyContent: 'center' }}>
                  <Button variant="contained" type="submit" form="form">
                    <FormattedMessage id="app.button.open_collection"></FormattedMessage>
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box >
  );
}

export default DisplayCollection;