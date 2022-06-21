import React, { useState, useEffect } from "react";
import { Avatar, Tooltip, Typography } from "@mui/material";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import OwnImage from "../images/Own.png";
import NotOwnImage from "../images/NotOwn.png";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardActions, CardMedia } from "@mui/material";
import styles from "../styles/Collections.css";
import BorderLinearProgressBar from "../components/BorderLinearProgressBar";
import { useLocation } from "react-router-dom";
import LogoDisplay from "../components/LogoDisplay";
import { CurrencyChecker } from "../utils/generic";
import Dialog from "@material-ui/core/Dialog";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ConfirmDialog from "../components/ConfirmDialog";

function DisplayCollection(props) {
  const [collectionItems, setCollectionItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [collected, setCollected] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [moneySpent, setMoneySpent] = useState(0);
  const currency = CurrencyChecker();
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const collections = ConfigService.getCollectionById(location.state.id)
      .then((response) => {
        //console.log(response.data);
        let col = 0;
        let money = 0;
        setCollectionItems(response.data);
        setTotalItems(response.data.length);
        response.data.map((item) => {
          if (item.own) {
            col = col + 1;
            money = money + item.price;
          }
        });
        setMoneySpent(money);
        setCollected(col);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOwnClick = (event, own) => {
    const toggle = ConfigService.toggleItemOwn(
      event.currentTarget.id,
      own
    ).then((response) => {
      var index = collectionItems.findIndex(
        (collectionItems) => collectionItems.id === response.data.id
      );
      let newItems = [...collectionItems];
      newItems[index].own = response.data.own;
      if (response.data.own) {
        setMoneySpent(moneySpent + response.data.price);
        setCollected(collected + 1);
      } else {
        setMoneySpent(moneySpent - response.data.price);
        setCollected(collected - 1);
      }
      setCollectionItems(newItems);
    });
  };

  const handleDeleteClick = () => {
    const deleteItem = ConfigService.deleteCollectionItem(value).then(
      (response) => {
        if (response.data === true) {
          toast.success(
            <FormattedMessage id="app.collection.item-deleted"></FormattedMessage>,
            { theme: "colored" }
          );
          window.location.reload(true);
        }
      }
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid container>
        <Grid item ml={"30%"} justifyContent="center">
          {location.state.logo.path
            ? LogoDisplay(location.state.logo.path)
            : null}
        </Grid>
        <Grid item xs={12}>
          <BorderLinearProgressBar
            variant="determinate"
            value={(collected / totalItems) * 100}
          ></BorderLinearProgressBar>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" component="div">
            <FormattedMessage id="app.collection.collected"></FormattedMessage>{" "}
            {collected + " / " + totalItems}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" component="div">
            <FormattedMessage id="app.collection.missing"></FormattedMessage>{" "}
            {totalItems - collected}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" component="div">
            <FormattedMessage id="app.collection.invested"></FormattedMessage>{" "}
            {
              <FormattedNumber
                value={moneySpent}
                style="currency"
                currency={currency.currency}
              />
            }
          </Typography>
        </Grid>
        <Grid
          container
          spacing={collectionItems.length}
          className="container"
          pt={3}
        >
          {collectionItems !== undefined
            ? collectionItems.map((item) => (
                <Grid item key={item.id}>
                  <Card
                    sx={{
                      height: 350,
                      minWidth: 250,
                      maxWidth: 250,
                      boxShadow: 5,
                    }}
                    ml={200}
                  >
                    <Box ml={23.1}>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "app.tooltip.click_own",
                        })}
                        placement="right"
                        arrow
                      >
                        <Button
                          id={item.id}
                          sx={{
                            position: "absolute",
                            height: 75,
                            width: 75,
                            ml: -1,
                            mt: -0.5,
                          }}
                          onClick={(e) => {
                            handleOwnClick(e, item.own);
                          }}
                          className="button-own"
                          startIcon={
                            <Avatar
                              variant="square"
                              sx={{ width: 75, height: 75, ml: 1, mt: 1 }}
                              src={item.own ? OwnImage : NotOwnImage}
                            />
                          }
                        >
                          <Typography
                            className="own-text"
                            sx={{ position: "absolute", ml: 2.5 }}
                          >
                            {item.own ? (
                              <FormattedMessage id="app.button.own"></FormattedMessage>
                            ) : (
                              <FormattedMessage id="app.button.not_own"></FormattedMessage>
                            )}
                          </Typography>
                        </Button>
                      </Tooltip>
                    </Box>
                    <CardContent>
                      {item.logo ? null : (
                        <Typography
                          align="center"
                          sx={{ fontSize: 20 }}
                          color="text.primary"
                          gutterBottom
                        ></Typography>
                      )}
                      <Tooltip
                        title={intl.formatMessage({
                          id: "app.tooltip.click_image",
                        })}
                        arrow
                        followCursor
                      >
                        <CardMedia
                          component="img"
                          width="100%"
                          image={require("../../../images/" + item.image.path)}
                          alt={item.name}
                          className="card-collection"
                          onClick={handleOpen}
                          style={styles}
                        />
                      </Tooltip>
                      {open && (
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        >
                          <LazyLoadImage
                            alt=""
                            height={350}
                            src={
                              item.image.path !== ""
                                ? require("../../../images/" + item.image.path)
                                : null
                            }
                            width="100%"
                          />
                        </Dialog>
                      )}
                      <Typography
                        align="center"
                        sx={{ mb: 0.5 }}
                        mt={1}
                        color="text.secondary"
                      >
                        {item.name}
                      </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        color="error"
                        type="submit"
                        form="form"
                        value={item.id}
                        onClick={() => {
                          setValue(item.id);
                          setConfirmOpen(true);
                        }}
                      >
                        <FormattedMessage id="app.button.delete"></FormattedMessage>
                      </Button>
                      <ConfirmDialog
                        title={intl.formatMessage({
                          id: "app.dialog.delete_title",
                        })}
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onConfirm={handleDeleteClick}
                      >
                        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
                      </ConfirmDialog>
                      <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        form="form"
                      >
                        <FormattedMessage id="app.button.edit"></FormattedMessage>
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DisplayCollection;
