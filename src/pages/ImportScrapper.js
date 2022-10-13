import React, { useState, useEffect} from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Grid, Card, CardContent, Avatar } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { AppContext } from "../components/AppContext";
import { FilterResultsByApiProvider } from "../utils/generic";

function ImportScrapper() {
  const navigate = useNavigate();
  //const intl = useIntl();
  const [apisList, setApisList] = useState([]);
  const { userData, setUserData } = React.useContext(AppContext);
  const [selectedApi, setSelectedApi] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [searchString, setSearchString] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  const [searching, setSearching] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [cardHover, setCardHover] = useState(null);
  const location = useLocation();

  useEffect(() => {
    ConfigService.getAllApis(userData.id)
      .then((response) => {
        setApisList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    //console.log(results);
  }, [results]);

  const importSelectedItem = () => {
    //console.log(selectedItem)
    ConfigService.importItemFromWeb(selectedItem)
      .then((response) => {
        if(response.status===200){
          toast.success(
            <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
            { theme: "colored" }
          );
          //console.log(response.data)
        }    
      })
  }

  const handleTextInputChange = (event) => {
    setSearchString(event.target.value);
  };

  const searchWebClick = () => {
    if(selectedApi.apiLink!==""){
      setStartSearch(true);
      ConfigService.getItemFromWeb(
        searchString,
        selectedApi
      ).then((response) => {
        //console.log(response.data)
        setResults(FilterResultsByApiProvider(response.data, selectedApi, location.state.id));
        setSearching(false);
        setStartSearch(false);
        setShowResults(true);
      });
    }
    else{
      toast.error(
        <FormattedMessage id="app.config.general.api-no_url"></FormattedMessage>,
        { theme: "colored" }
      );
    }
  };

  const avatarStyleClicked = {
    border: "2px solid green",
    width: 80,
    height: 80,
  };

  const avatarStyleHover = {
    cursor: "pointer",
    width: 80,
    height: 80,
  };

  const cardStyle = {
    display: 'block',
    width: 150,
  }

  const avatarCardStyle = {
    display: 'block',
    width: '120%',
    height: 200
  }

  const cardStyleHover = {
    cursor: "pointer",
    boxShadow: 15,
  };

  return (
    <Box sx={{ width: "60%" }}>
      <Grid container pb={2}>
        <Grid item xs={12} pt={2}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.add_collection_import_scrapper"></FormattedMessage>
          </Typography>
        </Grid>
        <Grid item xs={12} pt={2}>
          <TextField
            sx={{ minWidth: 300 }}
            size="small"
            id="outlined-basic"
            name="logo"
            label={
              <FormattedMessage id="app.collection.add_collection_import_scrapper_search"></FormattedMessage>
            }
            variant="outlined"
            value={searchString}
            onChange={handleTextInputChange}
          />
        </Grid>
        <Grid item xs={12} pt={2}>
          <Typography variant="h6" component="h4">
            <FormattedMessage
              id={
                showResults === false
                  ? "app.collection.select_option"
                  : "app.collection.add_collection_import_scrapper_search_results"
              }
            ></FormattedMessage>
          </Typography>
        </Grid>
      </Grid>
      {/*Listado de Apis*/}
      <Grid container sx={{ border: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {showResults === false &&
          apisList.map((item, index) => (
            <Grid item pl={2} pt={2} pb={2} key={index} >
              <Card>
                <Tooltip title={item.name} placement="bottom" arrow>
                  <Avatar
                    variant="rounded"
                    key={item.name}
                    sx={
                      selectedApi === item
                        ? avatarStyleClicked
                        : avatarStyleHover
                    }
                    src={item.logo} // use normal <img> attributes as props
                    width="100%"
                    onClick={(e) => {
                      setSelectedApi(item);
                    }}
                  />
                </Tooltip>
              </Card>
            </Grid>
          ))}
      </Grid>
      <Grid container sx={{ border: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {startSearch === true ? (
          <CircularProgress />
        ) : (
          results.map((item, index) => (
            <Grid item key={index} pl={2} pt={2} pb={2}>
              <Card style={cardStyle} sx={
                cardHover === item ? cardStyleHover :
                  {
                    boxShadow: 3,
                  }
              }
                onMouseOver={() => {
                  setCardHover(item)
                }}
                onMouseOut={() => {
                  setCardHover(null)
                }}>
                <CardContent style={{ display: 'flex', justifyContent: 'center' }} >
                  <Tooltip title={item.name} placement="bottom" arrow>
                    <Avatar style={avatarCardStyle}
                      variant="rounded"
                      key={item.name}
                      sx={
                        selectedItem === item
                          ? avatarStyleClicked
                          : avatarStyleHover
                      }
                      src={item.image} // use normal <img> attributes as props
                      width="100%"
                      onClick={(e) => {
                        setSelectedItem(item);
                      }}
                    />
                  </Tooltip>
                </CardContent>
                {item.name}
              </Card>
            </Grid>
          ))

        )}
      </Grid>
      <Grid container pt={2}>
        {showResults === false && (
          <Button
            variant="contained"
            onClick={() => {
              searchWebClick();
            }}
          >
            <FormattedMessage id="app.button.accept"></FormattedMessage>
          </Button>
        )}
        {showResults === true && (
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                disabled={selectedItem ? false : true}
                color="success"
                onClick={() => {
                  importSelectedItem();
                }}
              >
                <FormattedMessage id="app.collection.add_collection_import_scrapper_item"></FormattedMessage>
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  setResults([]);
                  setShowResults(false);
                }}
              >
                <FormattedMessage id="app.button.search_again"></FormattedMessage>
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default ImportScrapper;
