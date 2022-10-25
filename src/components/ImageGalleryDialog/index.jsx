import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage } from "react-intl";
import { Grid, Box, Avatar, TextField, Typography } from "@mui/material";
import { Tooltip } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import { AppContext } from "../../components/AppContext";

const ImageGalleryDialog = (props) => {
  const { title, open, setOpen, onConfirm, setImageSelected } = props;
  const [images, setImages] = useState([]);
  const [imageClicked, setImageClicked] = useState();
  const { userData, setUserData } = React.useContext(AppContext);

  useEffect(() => {
    if (open === true) {
      const query = {
        id: userData.id,
        orderField: "id",
        orderDirection: "up",
      };
      ConfigService.getLocalImages(query).then((response) => {
        var filteredResponse = []
        filteredResponse = response.data.content.filter(image => !image.path.includes("http"))
        filteredResponse.map((i) =>
          setImages((images) => [...images, i.path]));
      });
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
                spacing={1.2}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {images.map((i) => (
                  <Grid item xs={2} key={i}>
                    {console.log()}
                    <Tooltip title={i} placement="bottom" arrow>
                      <Avatar
                        key={i}
                        variant="rounded"
                        sx={
                          imageClicked === i
                            ? avatarStyleClicked
                            : avatarStyleHover
                        }
                        src={"/images/uploads/" + i} // use normal <img> attributes as props
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
            setImages([])
            onConfirm();
          }}
        >
          <FormattedMessage id="app.button.accept"></FormattedMessage>
        </Button>
        <Button variant="contained" onClick={() => {
          setOpen(false)
          setImages([])
        }
        }>
          <FormattedMessage id="app.button.cancel"></FormattedMessage>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ImageGalleryDialog;
