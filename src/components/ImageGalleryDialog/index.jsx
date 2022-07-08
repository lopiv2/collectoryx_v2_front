import React, { useState, useEffect } from 'react';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage } from "react-intl";
import { Grid, Box, Avatar } from "@mui/material";
import { getImagePaths } from '../../utils/generic';

const ImageGalleryDialog = (props) => {
    const { title, open, setOpen, onConfirm, setImageSelected } = props;
    const [images, setImages] = useState([]);
    var listOfImages = []

    useEffect(() => {

    }, [])

    useEffect(() => {
        if (open === true) {
            const directory = require.context("../../../../images/", false, /\.(png|jpe?g|svg)$/);
            listOfImages = getImagePaths(directory)
            setImages(listOfImages)
        }
    }, [open])

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="confirm-dialog"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
        >
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>
            <DialogContent>
                <Grid container style={{ border: "1px solid grey" }}>
                    <Grid>
                        {open && images.length > 0 && (
                            <Grid container spacing="20">
                                {images.map((i) =>
                                (<Grid item key={i}>
                                    <Avatar
                                        key={i}
                                        style={{ cursor: "pointer" }}
                                        variant="rounded"
                                        sx={{ width: 56, height: 56 }}
                                        src={require('../../../../images/' + i)} // use normal <img> attributes as props
                                        width="100%"
                                        onClick={((e) => {
                                            setImageSelected(e.target.src);
                                        })} />
                                </Grid>))}
                            </Grid>)
                        }
                    </Grid>
                </Grid>
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
        </Dialog >
    );
};
export default ImageGalleryDialog;