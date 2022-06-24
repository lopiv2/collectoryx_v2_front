import React, { useState, useEffect } from "react";
import { FormattedMessage } from 'react-intl';
import styles from "../../styles/Collections.css";
import { Box } from '@material-ui/core';
import {Grid} from "@material-ui/core";

function TagsInput(props) {

    const [fields, setFields] = useState(props)
    const [optionalFields, setOptionalFields] = useState(props)

    useEffect(() => {
        setFields(props.fields);
        setOptionalFields(props.optional);
    }, [props]);

    useEffect(() => {
        console.log(optionalFields.length)
    }, [optionalFields]);

    return (
        <Box sx={{ border: 1 }} style={styles} classname="tag-box">
            {fields.length > 0 ? fields.map((field, index) => (
                <Grid item className="tag-item" key={index}>
                    <span className="text">{field}</span>
                </Grid>
            )) : null}
            {/*optionalFields.length > 0 ? optionalFields.map((name, index) => (
                <Grid item className="tag-item" key={index}>
                    <span className="text">{name}</span>
                    <span className="close">&times;</span>
                </Grid>
            )) : null*/}
        </Box>

    )
}

export default TagsInput