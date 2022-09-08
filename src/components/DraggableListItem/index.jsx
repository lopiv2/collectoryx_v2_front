import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/styles';
import ListItem from '@material-ui/core/ListItem';
import { TextField, Select, MenuItem, Typography } from '@mui/material';
import OptionsService from '../DropDownOptions';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from '@material-ui/core';
import "../../styles/Collections.css";
import { Grid } from '@mui/material';

const useStyles = makeStyles({
    draggingListItem: {
        background: 'rgb(235,235,235)'
    },
    startICon: {
        margin: 10
    }
});

const DraggableListItem = (props) => {
    const classes = useStyles();
    const [fieldType, setFieldType] = useState("INTEGER");
    const [field, setField] = useState('')

    const handleChangeType = (event) => {
        setFieldType(event.target.value);
    };

    const handleClickDelete = () => {
        const temp = [...props.itemsList];

        // removing the element using splice
        if (props.index > -1) {
            temp.splice(props.index, 1);
        }

        // updating the list
        props.updateItems(temp);
        //props.updateOptionalFields(temp);
    };

    const onChangeField = (event) => {
        setField(event.target.value)
    }

    useEffect(() => {
        if (props.operation === "add") {
            props.itemsList[props.index].name = field;
            props.itemsList[props.index].type = fieldType;
        }
    }, [props.itemsList])

    return (
        <Draggable key={props.item} draggableId={props.item.id} index={props.index}>
            {(provided, snapshot) => (
                <Grid container>
                    <ListItem
                        divider
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? classes.draggingListItem : ''}
                    >
                        <Grid item xs={4}>
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label={props.item.name}
                                variant="outlined"
                                onChange={onChangeField} />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                value={props.operation === "add" ? fieldType : props.item.type}
                                id="demo-simple-select"
                                select
                                size="small"
                                onChange={handleChangeType}
                            >
                                {OptionsService.fieldTypes?.map(option => {
                                    return (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>
                        <Grid item mr={10}>
                            <Button
                                style={{ maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px' }}
                                variant="contained"
                                classes={{ startIcon: classes.startICon }}
                                color="secondary"
                                startIcon={<RemoveIcon style={{ float: 'right' }} classes={{ startIcon: classes.startICon }} />}
                                onClick={handleClickDelete}>
                            </Button>
                        </Grid>
                    </ListItem>
                </Grid >
            )}
        </Draggable >
    );
};

export default DraggableListItem;
