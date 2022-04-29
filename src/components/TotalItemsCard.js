import React from 'react';
import { Card, CardContent, CardActions, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import AppsIcon from '@mui/icons-material/Apps';
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

export default function TotalItemsCard() {
    return (
        <Card sx={{ minWidth: 200 }}>
            <CardContent>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 0, sm: 1, md: 1 }}>
                    <Grid item xs={2}>
                        <AppsIcon sx={{ fontSize: 80 }}></AppsIcon>
                    </Grid>
                    <Grid item xs={10}>
                        <Item>
                            <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                                <FormattedMessage id="app.total_items"></FormattedMessage>
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