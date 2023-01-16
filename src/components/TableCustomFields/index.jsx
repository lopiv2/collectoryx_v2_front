import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { makeStyles } from '@material-ui/styles';
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import ListItem from '@material-ui/core/ListItem';
import { TextField, MenuItem } from '@mui/material';
import OptionsService from '../DropDownOptions';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from '@material-ui/core';
import "../../styles/Collections.css";

const useStyles = makeStyles({
  draggingListItem: {
    background: 'rgb(235,235,235)'
  },
  startICon: {
    margin: 10
  }
});

export default function TableCustomFields(props) {
  const [itemList, setItemList] = useState([]);

  const classes = useStyles();
  const [fieldType, setFieldType] = useState("INTEGER");

  const handleChangeType = index => event => {
    const newField=itemList;
    newField[index].type=event.target.value;
    setItemList(newField);
  };

  const handleClickDelete = (index) => {
    const temp = [...itemList];
    // removing the element using splice
    if (index > -1) {
      temp.splice(index, 1);
    }
    // updating the list
    setItemList([])
    props.updateOptionalFields(temp);
  };

  const onChangeField = index => event => {
    const newField=itemList;
    newField[index].name=event.target.value;
    setItemList(newField);
  }

  useEffect(() => {
    if (props.operation === "add") {
      setItemList([])
      setItemList(props.rows)
    }
    if (props.operation === "edit") {
      setItemList(props.rows);
    }
  }, [props.rows]);

  return (
    itemList.length > 0 && (<Grid container>
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
        {itemList.map((item, index) => (
          <Grid container key={index}>
            <ListItem
              divider
            >
              <Grid item xs={4}>
                <TextField
                  id="outlined-basic"
                  size="small"
                  label={item.name}
                  variant="outlined"
                  onChange={onChangeField(index)} />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  defaultValue="INTEGER"
                  id="demo-simple-select"
                  select
                  size="small"
                  onChange={handleChangeType(index)}
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
                  onClick={() => handleClickDelete(index)}>
                </Button>
              </Grid>
            </ListItem>
          </Grid >
        ))}
      </Grid>
    </Grid>)
  );
}
