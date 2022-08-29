import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage, useIntl } from "react-intl";
import { Grid, Box, Avatar, TextField, Typography } from "@mui/material";
import { getImagePaths } from "../../utils/generic";
import { Tooltip } from "@mui/material";

const ImageGalleryDialog = (props) => {
  const { title, open, setOpen, onConfirm, setImageSelected } = props;
  const [images, setImages] = useState([]);
  const [imageClicked, setImageClicked] = useState();
  var listOfImages = [];
  const intl = useIntl();

  useEffect(() => { }, []);

  useEffect(() => {
    if (open === true) {
      const directory = require.context(
        "../../../public/images/",
        false,
        /\.(png|jpe?g|svg)$/
      );
      listOfImages = getImagePaths(directory);
      setImages(listOfImages);
    }
  }, [open]);

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

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    >
      <DialogTitle id="confirm-dialog">
        <Typography component="p" variant="h5" align="center">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item pt={1}>
            <Typography variant="body1">
              <FormattedMessage id="app.dialog.search_image"></FormattedMessage>
            </Typography>
          </Grid>
          <Grid item pb={1}>
            <TextField variant="outlined" size="small"></TextField>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex" }}>
          <Grid container style={{ border: "3px solid grey" }}>
            {open && images.length > 0 && (
              <Grid
                container
                spacing={{ xs: 5, md: 15 }}
                columns={{ xs: 4, sm: 8, md: 12 }}>
                {images.map((i) => (
                  <Grid item xs={2} key={i}>
                    <Tooltip
                      title={i}
                      placement="bottom"
                      arrow
                    >
                      <Avatar
                        key={i}
                        variant="rounded"
                        sx={
                          imageClicked === i
                            ? avatarStyleClicked
                            : avatarStyleHover
                        }
                        src={require("../../../public/images/" + i)} // use normal <img> attributes as props
                        width="100%"
                        onClick={(e) => {
                          setImageClicked(i);
                          setImageSelected(i);
                        }}
                      />
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
        >
          <FormattedMessage id="app.button.accept"></FormattedMessage>
        </Button>
        <Button variant="contained" onClick={() => setOpen(false)}>
          <FormattedMessage id="app.button.cancel"></FormattedMessage>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ImageGalleryDialog;
