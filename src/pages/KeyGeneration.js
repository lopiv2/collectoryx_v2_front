import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

function KeyGeneration(props) {
    const intl = useIntl();

    return (
        <Box sx={{ display: "flex" }}>
            <Grid container>
                <Grid item xs={6}>
                    <TextField
                        sx={{ minWidth: 300 }}
                        size="small"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                        value={values.name}
                    />
                </Grid>
            </Grid>
        </Box>);
}

export default KeyGeneration;
