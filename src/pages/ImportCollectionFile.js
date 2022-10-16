import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField, Stepper, Step, StepButton } from "@mui/material";
import { Box, ListItem } from "@mui/material";
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

function ImportCollectionFile() {
  const [selectedFile, setSelectedFile] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [records, setRecords] = useState([]); //Trae los campos del Header del CSV de la API
  const navigate = useNavigate();
  const intl = useIntl();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  //const [finished, setFinished] = React.useState(false); //Acabada la importacion o no
  const [fields, setFields] = useState([]); //Campos por defecto en coleccion
  const [mappings, setMappings] = useState([]); //Mapeos
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const checkValue = (item) => {
    const result = records.find((record) => record.name === "item");
    return result;
  };

  const handleChangeCollection = (event) => {
    setCollection(event.target.value);
  };

  const setValue = (event, field) => {
    const fieldId = intl.formatMessage({
      id: field.value,
    });
    var index = mappings.findIndex((mapping) => mapping.original === field.key);
    const updatedMappings = [...mappings];
    updatedMappings[index].new = event;
    setMappings(updatedMappings);
  };

  function handleFileUpload() {
    ConfigService.putFile(selectedFile).then((response) => {
      setLoading(false);
      setRecords(response.data);
    });
  }

  function parseFile() {
    var res = 0;
    if (!parseTriggeredRef.current) {
      ConfigService.parseFile(mappings).then((response) => {
        //console.log(response.data)
        res = response.data;
        parseTriggeredRef.current = true;
        toast.success(
          <FormattedMessage id="app.collection.created"></FormattedMessage>,
          { theme: "colored" }
        );
        setRecordsImported(res);
        setTimeout(() => {
          navigate(-1);
        }, 3000);      
      });
    }
  }

  useEffect(() => {
    if (
      !effectTriggeredRef.current &&
      records.length > 0 &&
      fields.length > 0
    ) {
      for (let i = 0; i < fields.length; i++) {
        const field = intl.formatMessage({
          id: fields[i].value,
        });
        const data = {
          original: fields[i].key,
          new: records[i].name,
        };
        setMappings((mappings) => [...mappings, data]);
      }
      const col = {
        collection: collectionList[0].id,
      };
      setMappings((mappings) => [...mappings, col]);
      effectTriggeredRef.current = true;
    }
  }, [records, fields, collectionList]);

  useEffect(() => {
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
    } else {
      setFields("");
    }
  }, []);

  useEffect(() => {
    if (activeStep === 1 && selectedFile !== null && isLoading === true) {
      handleFileUpload();
      handleCompleteNoNext();
    }
  }, [selectedFile, activeStep]);

  const steps = [
    {
      label: "Import file",
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
      label: "Link fields",
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
                        value={intl.formatMessage({
                          id: fields[index].value,
                        })}
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
                          onChange={(e) =>
                            setValue(e.target.value, fields[index])
                          }
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
      label: "Start importing",
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
    setActiveStep(0);
    setCompleted({});
  };

  useEffect(() => {
    if (selectedFile !== "") {
      handleCompleteNoNext();
    }
  }, [selectedFile]);

  return (
    <Box sx={{ width: "60%" }}>
      <Typography variant="h4" component="h4">
        <FormattedMessage id="app.collection.import_collection_title"></FormattedMessage>
      </Typography>
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
            {parseTriggeredRef === false ? (
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
                <FormattedMessage id="app.collection.import_collection_next"></FormattedMessage>
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
    </Box>
  );
}

export default ImportCollectionFile;
