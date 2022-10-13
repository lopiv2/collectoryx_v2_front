import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage } from "react-intl";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { FormControlLabel } from "@mui/material";

const ConfirmDialog = (props) => {
  const { title, children, open, setOpen, onConfirm } = props;

  const handleChangeCascade = (event) => {
    props.setCascade(event.target.checked)
  };

  return (
    <Dialog
      disableEnforceFocus
      open={open}
      onClose={() => { setOpen(false); props.setCascade(false) }}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}
        <Grid item xs={12}>
          {props.showCascade === true && (
            <Box pt={0} ml={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="SomeName"
                    value="SomeValue"
                    onChange={handleChangeCascade}
                  />
                }
                label={<Typography variant="body2" color="textPrimary">
                  <FormattedMessage id="app.dialog.cascade_delete"></FormattedMessage>
                </Typography>} />
            </Box>
          )}
        </Grid></DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item xs={3} ml={12}>
            <Button variant="contained" onClick={() => setOpen(false)}>
              <FormattedMessage id="app.button.no"></FormattedMessage>
            </Button>
          </Grid>
          <Grid item xs={4} ml={2}>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
            >
              <FormattedMessage id="app.button.yes"></FormattedMessage>
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
