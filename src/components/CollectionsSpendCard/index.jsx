import React from 'react';
import { Card, CardContent, CardActions, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import PaidIcon from '@mui/icons-material/Paid';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function CollectionsSpentCard() {
    return (
        <Card sx={{ minWidth: 200 }} style={{ backgroundColor: "#217dbf" }}>
            <CardContent >
                <Grid container rowSpacing={2} columnSpacing={{ xs: 0, sm: 1, md: 1 }}>
                    <Grid item xs={2}>
                        <PaidIcon sx={{ fontSize: 80 }}></PaidIcon>
                    </Grid>
                    <Grid item xs={10}>
                        <Item style={{ backgroundColor: "#3f9de0" }}>
                            <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                                <FormattedMessage id="app.money_spent"></FormattedMessage>
                            </Typography>
                            <Typography sx={{ fontSize: 15 }} color="text.secondary" gutterBottom>
                                ******
                            </Typography>
                        </Item>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}