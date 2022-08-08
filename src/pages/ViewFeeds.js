import React, { useEffect, useState } from "react";
import Parser from "rss-parser";
import { parse } from "himalaya";
import "../styles/Dashboard.css";
import xml from 'xml-js'
import ConfigService from "../app/api/config.api";
import {
    TextField,
    Button,
    Grid,
    Box,
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    Avatar,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export default function ViewFeeds(props) {
    const parser = new Parser({
        customFields: {
            feed: ['image'],
            item: [["media:content", "media:content", { keepArray: true }]],
        },
    });
    const [feedsList, setFeedsList] = useState([]);
    const location = useLocation();
    let image = "";

    if (localStorage.getItem("user")) {
        var user = localStorage.getItem("user");
        var userData = JSON.parse(user);
    }

    const parseContentHTMLForImage = (html) => {
        const json = parse(html);
        json.map((item) => {
            if (item.tagName === "img") {
                image = item.attributes[0].value;
            }
            if (item.tagName === "p") {
                for (let i = 0; i < item.children.length; i++) {
                    if (item.children[i].tagName === "img") {
                        console.log(item.children[i].attributes[2].value);
                        image = item.children[i].attributes[2].value
                        //image = item.attributes[0].value;
                        //return item.children[i];
                    }
                }
            }
        });
    };

    /*useEffect(() => {
      console.log("Location changed");
    }, [location]);*/

    useEffect(() => {
        const feeds = ConfigService.getUserFeedsIDTitle(
            userData.id,
            location.state
        ).then((response) => {
            //console.log(response.data)
            const myJSON = JSON.stringify(response.data);
            console.log(myJSON.indexOf('img src='))
            if (myJSON.includes("image")) {
                //console.log("image")
            }
            if (response.data.includes("img")) {
                //console.log("img")
            }
            //var result1 = xml.xml2json(response.data, {compact: true, spaces: 1});
            //console.log(result1)
            var feed = parser.parseString(response.data).then((resp) => {
                setFeedsList(resp.items);
                //console.log(resp.items);
            });
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
                            <Card
                                sx={{ height: 400, minWidth: 250, maxWidth: 250, boxShadow: 5 }}
                                ml={200}
                            >
                                {parseContentHTMLForImage(item.content)}
                                <CardMedia
                                    component="img"
                                    image={image ?? image}
                                    className="card-collection"
                                    style={{ height: "auto" }}
                                >
                                    {/*console.log(parseContentHTMLForImage(item.content))*/}
                                </CardMedia>
                                <CardHeader
                                    sx={{
                                        display: "flex",
                                        overflow: "hidden",
                                        "& .MuiCardHeader-content": {
                                            overflow: "hidden",
                                        },
                                    }}
                                    title={
                                        <Typography gutterBottom noWrap variant="h6" component="h4">
                                            {item.title}
                                        </Typography>
                                    }
                                    titleTypographyProps={{ noWrap: true }}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="initial"></Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
}
