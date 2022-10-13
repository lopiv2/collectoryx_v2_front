import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FormattedMessage, useIntl } from "react-intl";
import { Grid, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from '@mui/icons-material/Close';

const FeaturesDialog = (props) => {
  const { title, open, setOpen, rows } = props;
  const intl = useIntl();



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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: "app.license.free" })}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: "app.license.paid_lic" })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 && rows.map((row, index) => (
                  row.type === "full" && (<TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {intl.formatMessage({ id: row.id })}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.valueFree != null
                        ? row.valueFree
                        : row.iconFree === "done"
                          ? (<DoneIcon color="success" />)
                          : (<CloseIcon sx={{ color: "red" }} />)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.valuePremium != null
                        ? intl.formatMessage({ id: row.valuePremium })
                        : row.iconPremium === "done"
                          ? (<DoneIcon color="success" />)
                          : (<CloseIcon sx={{ color: "red" }} />)}
                    </TableCell>
                  </TableRow>)
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
          }}
        >
          <FormattedMessage id="app.button.close"></FormattedMessage>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default FeaturesDialog;
