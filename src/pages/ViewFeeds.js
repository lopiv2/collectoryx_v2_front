import React, { useEffect, useState } from "react";
import Parser from "rss-parser";
import "../styles/Dashboard.css";
import xml from "xml-js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ConfigService from "../app/api/config.api";
import CircleIcon from '@mui/icons-material/Circle';
import {
    Button,
    Grid,
    Box,
    Typography,
    Card,
    CardHeader,
    CardMedia,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";


export default function ViewFeeds(props) {
    const parser = new Parser({});
    const [feedsList, setFeedsList] = useState([]);
    const location = useLocation();

    if (localStorage.getItem("user")) {
        var user = localStorage.getItem("user");
        var userData = JSON.parse(user);
    }

    const theme = createTheme({
        typography: {
            useNextVariants: true,
            poster: {
                color: 'red',
            },
            // Disable h3 variant
            h3: undefined,
        },
    });


    useEffect(() => {
        const feeds = ConfigService.getUserFeedsIDTitle(
            userData.id,
            location.state
        ).then((response) => {
            //console.log(response.data);
            setFeedsList(response.data);
        });
    }, [location]);

    return (
        <Box sx={{ display: "flex" }}>
            <Grid>
                {/*breadcrumbs.map(({
          match,
          breadcrumb
        }) => (
          <span key={match.pathname}>
             / 
            <NavLink to={match.pathname}>{breadcrumb}</NavLink>
          </span>
        ))*/}
                <Grid item xs={12}>
                    <Typography variant="h4" component="h4">
                        <FormattedMessage
                            id="app.feed.title"
                            values={{
                                site: location.state ?? location.state,
                            }}
                        ></FormattedMessage>
                    </Typography>
                </Grid>
                <Grid container spacing={10} className="container">
                    {feedsList.map((item, index) => (
                        <Grid item key={index}>
                            {console.log(item.link)}
                            <Button href={item.link}>
                                <Card
                                    className="cardListItem-img-feed"
                                    ml={200}
                                >
                                    <Grid container justifyContent="center">
                                        <CardMedia
                                            height="140"
                                            component="img"
                                            image={item.image ?? item.image}
                                            className="cardListItem-img-media"
                                            style={{ height: "auto", width: "auto", alignItems: 'center' }}
                                        ></CardMedia>
                                    </Grid>
                                    <Grid container justifyContent="flex-end" style={{
                                        paddingTop: "0px"
                                    }}>
                                        <Grid item >
                                            <CircleIcon sx={{ color: "orange", fontSize: "10px" }} fontSize="small"></CircleIcon>
                                        </Grid>
                                        <Grid item >
                                            <Typography display="inline" variant="subtitle1">
                                                {item.pubDate}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <CardHeader
                                        sx={{
                                            display: "flex",
                                            padding: 20,
                                            overflow: "hidden",
                                            "& .MuiCardHeader-content": {
                                                overflow: "hidden",
                                            },
                                        }}
                                        title={
                                            <Typography style={{ wordWrap: "break-word" }} variant="poster" component="h4">
                                                {item.title}
                                            </Typography>
                                        }
                                        titleTypographyProps={{ noWrap: true }}
                                    />
                                </Card>
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Box >
    );
}
