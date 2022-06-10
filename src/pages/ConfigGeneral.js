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

function ConfigGeneral() {
    return (
        <Box sx={{ display: 'flex' }}>
            <ToastContainer autoClose={2000} />
            <Grid>
                <Grid item xs={6}>
                    <Typography variant="h4" component="h4">
                        <FormattedMessage id="app.config.general_title"></FormattedMessage>
                    </Typography>
                </Grid>
                <Grid item>
                    Opcion para mostrar logo en lugar del titulo o viceversa
                </Grid>
                <Grid item>
                    Opciones premium
                </Grid>
            </Grid>
        </Box>
    )
}

export default ConfigGeneral;