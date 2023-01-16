import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField, Stepper, Step, StepButton } from "@mui/material";
import { Box, ListItem, List } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OptionsService from "../components/DropDownOptions";
import CircularProgress from "@mui/material/CircularProgress";
import { AppContext } from "../components/AppContext";
import { Navigate } from "react-router-dom";
import { isUndefined } from "lodash";

function ImportCollectionFile() {
  const [selectedFile, setSelectedFile] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [records, setRecords] = useState([]); //Fetch CSV Header fields from the API
  const navigate = useNavigate();
  const intl = useIntl();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [fieldsFilled, setFieldsFilled] = useState(false); //Whether or not the fields have been filled in
  const [fields, setFields] = useState([]); //Default fields in collection
  const [mappings, setMappings] = useState([]); //Mappings
  const effectTriggeredRef = React.useRef(false);
  const parseTriggeredRef = useRef(false);
  const [collectionList, setCollectionList] = useState([]);
  const [collection, setCollection] = useState();
  const [recordsImported, setRecordsImported] = useState(0);
  const { userData, setUserData } = React.useContext(AppContext);

  useEffect(() => {
    const query = {
      id: userData.id,
      orderField: "name",
      orderDirection: "up",
    };
    ConfigService.getCollectionLists(query)
      .then((response) => {
        setCollection(response.data.content[0].id);
        setCollectionList(response.data.content);
        //mapFields(response.data.content[0].id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    //if the active step is the mapping screen, and file uploaded is not null and records from file are fullfilled...
    if (activeStep === 1 && selectedFile !== null && records.length > 0) {
      mapFields(collection);
      //mapValues();
    }
  }, [activeStep, records]);

  const checkValue = (item) => {
    const result = records.find((record) => record.name === "item");
    return result;
  };

  //At each change of collection, I get all the Fields fields
  const handleChangeCollection = (event) => {
    setCollection(event.target.value);
    setMappings([]);
    setFields([]);
    setFieldsFilled(false);
    mapFields(event.target.value);
  };

  //If the fields are already filled with their variable, I do the mapping by calling mapValues()
  useEffect(() => {
    if (fieldsFilled === true) {
      mapValues();
      //console.log(fields);
    }
  }, [fieldsFilled]);

  //If the fields are already filled, I set the fieldsFilled variable to true.
  useEffect(() => {
    if (fields.length !== 0) {
      setFieldsFilled(true);
    } else {
      setFieldsFilled(false);
    }
  }, [fields]);

  //Pick the default fields from collection
  const mapFields = (event) => {
    var tempArray = [];
    tempArray = OptionsService.createCollectionOptions.find(
      (f) => f.value === "New"
    );
    if (tempArray) {
      for (let i = 0; i < tempArray.fields.length; i++) {
        const field = {
          key: tempArray.fields[i].key,
          value: tempArray.fields[i].value.props.id,
        };
        setFields((fields) => [...fields, field]);
      }
      if (collectionList.length > 0) {
        var index = collectionList.findIndex((col) => col.id === event);
        if (collectionList[index].metadata !== null) {
          if (collectionList[index].metadata.length > 0) {
            for (let i = 0; i < collectionList[index].metadata.length; i++) {
              const field = {
                key: collectionList[index].metadata[i].id,
                value: collectionList[index].metadata[i].name,
              };
              setFields((fields) => [...fields, field]);
            }
          }
        }
      }
    } else {
      setFields([]);
    }
  };

  const mapValues = () => {
    for (let i = 0; i < fields.length; i++) {
      const data = {
        original: fields[i].key,
        new: records[0].name,
      };
      setMappings((mappings) => [...mappings, data]);
    }
    const col = {
      original: "collection",
      new: collection,
    };
    setMappings((mappings) => [...mappings, col]);
  };

  const setValue = (event, field) => {
    /*const fieldId = intl.formatMessage({
      id: field.value,
    });*/
    var index = mappings.findIndex((mapping) => mapping.original === field.key);
    const updatedMappings = [...mappings];
    updatedMappings[index].new = event;
    setMappings(updatedMappings);
  };

  function handleFileUpload() {
    ConfigService.putFile(selectedFile).then((response) => {
      setLoading(false);
      /*const data = [
      { name: "id" },
      { name: "serie" },
      { name: "hola" },
      { name: "prueba" },
      { name: "casa" },
    ];
    setRecords(data);*/
      setRecords(response.data);
    });
  }

  function parseFile() {
    var res = 0;
    if (!parseTriggeredRef.current) {
      //console.log(mappings);
      //console.log(collection);
      ConfigService.parseFile(mappings).then((response) => {
        //console.log(response.data)
        res = response.data;
        parseTriggeredRef.current = true;
        setRecordsImported(res);
        toast.success(
          <FormattedMessage id="app.collection.created"></FormattedMessage>,
          { theme: "colored" }
        );
      });
    }
  }

  useEffect(() => {
    if (
      !effectTriggeredRef.current &&
      records.length > 0 &&
      fields.length > 0 &&
      fieldsFilled === true
    ) {
      effectTriggeredRef.current = true;
    }
  }, [records, fields]);

  useEffect(() => {
    if (activeStep === 1 && selectedFile !== null && isLoading === true) {
      handleFileUpload();
      handleCompleteNoNext();
    }
  }, [selectedFile, activeStep]);

  const steps = [
    {
      label: intl.formatMessage({
        id: "app.collection.import_file",
      }),
      content: (
        <Box>
          <Box sx={{ pt: 2 }}>
            <TextField
              sx={{ minWidth: 300 }}
              size="small"
              id="outlined-basic"
              name="logo"
              label={
                <FormattedMessage id="app.collection.import_collection_file"></FormattedMessage>
              }
              variant="outlined"
              value={selectedFile.name || ""}
            />
            <Button variant="contained" component="label">
              {
                <FormattedMessage id="app.collection.import_collection_upload"></FormattedMessage>
              }
              <input
                type="file"
                hidden
                name="file"
                accept=".csv,.json"
                onChange={(e) => {
                  setSelectedFile(e.currentTarget.files[0]);
                }}
              />
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      label: intl.formatMessage({
        id: "app.collection.import_link_fields",
      }),
      content:
        selectedFile !== "" && activeStep === 1 ? (
          <Box>
            {isLoading === true ? (
              <CircularProgress />
            ) : (
              <Grid container pt={2}>
                <Grid item xs={12} pb={2}>
                  <Typography variant="h5" component="h4">
                    <FormattedMessage id="app.collection.add_collection_import_select_option"></FormattedMessage>
                  </Typography>
                </Grid>
                <Grid item xs={9} pb={2}>
                  <TextField
                    id="demo-simple-select"
                    name="collection"
                    select
                    size="small"
                    sx={{ minWidth: 300 }}
                    value={collection ?? collection}
                    label={
                      <FormattedMessage id="app.collection.add_collection_name"></FormattedMessage>
                    }
                    onChange={handleChangeCollection}
                  >
                    {collectionList?.map((option) => {
                      return (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={10}
                  pb={2}
                  pt={2}
                  pl={2}
                  style={{ border: "1px solid grey" }}
                >
                  <FormattedMessage id="app.collection.add_collection_import_instructions"></FormattedMessage>
                </Grid>
                <Grid item xs={4} pb={2} pt={2} pl={10}>
                  <Typography style={{ fontWeight: 600 }}>
                    <FormattedMessage id="app.collection.add_collection_import_columns"></FormattedMessage>
                  </Typography>
                </Grid>
                {fields.map((item, index) => (
                  <ListItem divider key={index}>
                    <Grid item xs={4}>
                      <TextField
                        id="outlined-basic"
                        size="small"
                        label={item.name}
                        value={
                          item.value.includes("app.collection")
                            ? intl.formatMessage({
                              id: item.value,
                            })
                            : item.value
                        }
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      {"->"}
                    </Grid>
                    <Grid item xs={2}>
                      {records.length > 0 && mappings.length > 0 && (
                        <TextField
                          defaultValue={checkValue(item.name)}
                          value={mappings[index].new}
                          select
                          id="demo-simple-select"
                          size="small"
                          onChange={(e) => setValue(e.target.value, item)}
                        >
                          {records?.map((option) => {
                            return (
                              <MenuItem key={option.name} value={option.name}>
                                {option.name ?? option.name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      )}
                    </Grid>
                  </ListItem>
                ))}
              </Grid>
            )}
          </Box>
        ) : (
          "hola"
        ),
    },
    {
      label: intl.formatMessage({
        id: "app.collection.import_start import",
      }),
      content: (
        <Box>
          <Grid container pt={2}>
            <Grid
              item
              xs={10}
              pb={2}
              pt={2}
              pl={2}
              style={{ border: "1px solid grey" }}
            >
              <FormattedMessage id="app.collection.add_collection_import_start"></FormattedMessage>
            </Grid>
          </Grid>
        </Box>
      ),
    },
  ];

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleCompleteNoNext = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
  };

  const handleReset = () => {
    //setActiveStep(0);
    //setCompleted({});
    navigate(0);
  };

  useEffect(() => {
    if (selectedFile !== "") {
      handleCompleteNoNext();
    }
  }, [selectedFile]);

  return (
    <Box sx={{ width: "60%" }}>
      <Grid container >
        <Typography variant="h4" component="h4">
          <FormattedMessage id="app.collection.add_collection_import"></FormattedMessage>
        </Typography>
        <Grid container item xs={12} sx={{ backgroundColor: "rgba(0, 161, 32, 0.2)", border: 1, borderRadius: 2 }}>
          <List sx={{
            pl: 4,
            listStyleType: 'disc',
            '& .MuiListItem-root': {
              display: 'list-item',
            },
          }}>
            <Typography variant="body1" sx={{fontWeight:800}}>
            <FormattedMessage id="app.collection.add_collection_import_help"></FormattedMessage>
            </Typography>
            <ListItem>
              <FormattedMessage id="app.collection.add_collection_import_date_format"></FormattedMessage>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} pt={2}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((step, index) => (
              <Step key={step.label} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {step.label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            {allStepsCompleted() ? (
              <Box>
                {parseFile()}
                {parseTriggeredRef.current === false ? (
                  <CircularProgress />
                ) : (
                  <Box>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <FormattedMessage
                        id="app.collection.add_collection_import_records_numbers"
                        values={{
                          records: recordsImported ?? recordsImported,
                        }}
                      ></FormattedMessage>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Box>
                {steps[activeStep].content}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    <FormattedMessage id="app.collection.import_collection_back"></FormattedMessage>
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    onClick={handleNext}
                    sx={{ mr: 1 }}
                    disabled={activeStep === 0 && selectedFile === ""}
                  >
                    {activeStep !== 2 && (<FormattedMessage id="app.collection.import_collection_next"></FormattedMessage>)}
                  </Button>
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography
                        variant="caption"
                        sx={{ display: "inline-block" }}
                      >
                        {/*Step {activeStep + 1} already completed*/}
                      </Typography>
                    ) : (
                      <Button onClick={handleComplete}>
                        {completedSteps() === totalSteps() - 1 ? (
                          <FormattedMessage id="app.collection.import_collection_start"></FormattedMessage>
                        ) : (
                          "Complete Step"
                        )}
                      </Button>
                    ))}
                </Box>
              </Box>
            )}
          </div>
        </Grid>
      </Grid>
    </Box >
  );
}

export default ImportCollectionFile;
