import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import {
  TextField,
  Stepper,
  Step,
  StepButton,
  StepContent,
  StepLabel,
} from "@mui/material";
import { Box, ListItem } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OptionsService from "../components/DropDownOptions";
import AddIcon from "@mui/icons-material/Add";
import TableCustomFields from "../components/TableCustomFields";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function ImportCollectionFile() {
  const [selectedFile, setSelectedFile] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [records, setRecords] = useState([]); //Trae los campos del Header del CSV de la API
  const navigate = useNavigate();
  const intl = useIntl();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [fields, setFields] = useState([]); //Campos por defecto en coleccion
  const [mappings, setMappings] = useState([]); //Mapeos
  const effectTriggeredRef = React.useRef(false);

  const checkValue = (item) => {
    const result = records.find((record) => record.name === "item");
    return result;
  };

  const setValue = (event, field) => {
    const fieldId = intl.formatMessage({
      id: field.props.id,
    });
    var index = mappings.findIndex((mapping) => mapping.original === fieldId);
    const updatedMappings = [...mappings];
    updatedMappings[index].new = event;
    setMappings(updatedMappings);
  };

  function handleFileUpload() {
    const file = ConfigService.putFile(selectedFile).then((response) => {
      setLoading(false);
      setRecords(response.data);
    });
  }

  /*useEffect(() => {
    console.log(mappings);
  }, [mappings]);*/

  useEffect(() => {
    if (
      !effectTriggeredRef.current &&
      records.length > 0 &&
      fields.length > 0
    ) {
      for (let i = 0; i < fields.length; i++) {
        const field = intl.formatMessage({
          id: fields[i].props.id,
        });
        const data = {
          original: field,
          new: records[i].name,
        };
        setMappings((mappings) => [...mappings, data]);
      }
      effectTriggeredRef.current = true;
    }
  }, [records, fields]);

  useEffect(() => {
    setFields(
      OptionsService.createCollectionOptions.find((f) => f.value === "New")
        .fields
    );
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
                <Grid
                  item
                  xs={10}
                  pb={2}
                  pt={2}
                  pl={2}
                  style={{ border: "1px solid grey" }}
                >
                  Conecte cada campo de la derecha con el de la izda para
                  importar correctamente cada columna
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
                          id: fields[index].props.id,
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
    console.log("empiezo")
    //handleNext();
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
            <Typography sx={{ mt: 2, mb: 1 }}>
              <CircularProgress />
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
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
