
import { Card, CardContent, CardActions, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import ConfigService from "../../app/api/config.api";
import React, { useState, useEffect } from 'react';
import { AppContext } from "../AppContext";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function RecentPurchaseCard() {
    const [collectionTotalCount, setCollectionTotalCount] = useState(0);
    const { userData, setUserData } = React.useContext(AppContext);

    useEffect(() => {
        const collections = ConfigService.countCollections(userData.id).then((response) => {
            setCollectionTotalCount(response);
        })
            .catch(err => {
                console.log(err);
            });
    }, [])

    return (
        <Card sx={{ minWidth: 200 }} elevation={6}>
            <CardContent>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 0, sm: 1, md: 1 }}>
                    <Grid item xs={2}>
                        <CollectionsBookmarkIcon sx={{ fontSize: 80 }}></CollectionsBookmarkIcon>
                    </Grid>
                    <Grid item xs={10}>
                        <Item>
                            <Typography sx={{ fontSize: 30, fontWeight: 600 }} color="text.secondary" gutterBottom>
                                {collectionTotalCount}
                            </Typography>
                            <Typography sx={{ fontSize: 13 }} color="text.primary" gutterBottom>
                                <FormattedMessage id="app.total_collections"></FormattedMessage>
                            </Typography>
                        </Item>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}