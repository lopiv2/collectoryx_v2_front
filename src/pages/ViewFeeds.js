import React, { useState } from "react";
import Parser from 'rss-parser'
import ConfigService from "../app/api/config.api";
import { TextField, Button, Grid } from "@material-ui/core";

export default function ViewFeeds() {
    const parser = new Parser();
    const [feedUrl, setFeedUrl] = useState();
    

    const handleSubmit = async () => {

        const feed = await parser.parseURL(feedUrl);
        console.log(feed.title); // feed will have a `foo` property, type as a string

        feed.items.forEach(item => {
            console.log(item.title + ':' + item.link) // item will have a `bar` property type as a number
        });
    }

    return (
        <Grid container>
            <TextField onChange={(v) => setFeedUrl(v.target.value)}></TextField>
            <Button variant="contained" onClick={() => handleSubmit()}> Prueba</Button>
        </Grid>

    )
}

