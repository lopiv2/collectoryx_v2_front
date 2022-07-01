import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { TextField, Select, MenuItem, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import {
    DragDropContext,
    Droppable,
    OnDragEndResponder
} from 'react-beautiful-dnd';
import DraggableListItem from '../DraggableListItem';
import "../../styles/Collections.css";

export default function TableCustomFields(props) {
    const [itemList, setItemList] = useState(props.rows);

    const handleDrop = (droppedItem) => {
        // Ignore drop outside droppable container
        if (!droppedItem.destination) return;
        var updatedList = [...itemList];
        // Remove dragged item
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        // Add dropped item
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        // Update State
        setItemList(updatedList);
    };

    useEffect(() => {
        setItemList(props.rows);
    }, [props.rows])

    return (
        <DragDropContext onDragEnd={handleDrop}>
            <Grid container >
                <Grid item xs={3} ml={8}>
                    <Typography style={{ fontWeight: 600 }}>
                        <FormattedMessage id="app.collection.add_collection_field_name"></FormattedMessage>
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography style={{ fontWeight: 600 }}>
                        <FormattedMessage id="app.collection.add_collection_field_type"></FormattedMessage>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Droppable droppableId="droppable-list">
                        {provided => (
                            <div className="list-container" ref={provided.innerRef} {...provided.droppableProps}>
                                {itemList.map((item, index) => (
                                    <DraggableListItem
                                        className="item-container"
                                        updateOptionalFields={props.updateFields}
                                        updateItems={setItemList}
                                        item={item}
                                        index={index}
                                        key={item.id}
                                        itemsList={itemList} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Grid>
            </Grid>

        </DragDropContext>
    );
};