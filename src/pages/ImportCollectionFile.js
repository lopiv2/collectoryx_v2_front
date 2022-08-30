import React, { useState, useEffect } from "react";
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
import { Box } from "@mui/material";
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

function ImportCollectionFile() {
  const [selectedFile, setSelectedFile] = useState("");
  const navigate = useNavigate();
  const intl = useIntl();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

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
      content: selectedFile !== "" ?? handleFileUpload
    },
    {
      label: "Start importing",
      content: `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`,
    },
  ];

  const handleFileUpload = () => {
    const file = ConfigService.putFile(selectedFile, selectedFile)
      .then((resp) => {
        console.log(resp.data)
      })
  };

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
              All steps completed - you&apos;re finished
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
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                <FormattedMessage id="app.collection.import_collection_next"></FormattedMessage>
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography
                    variant="caption"
                    sx={{ display: "inline-block" }}
                  >
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? "Finish"
                      : "Complete Step"}
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
