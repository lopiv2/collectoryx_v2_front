import React, { useEffect } from 'react';
import { Grid, FormControlLabel, RadioGroup, Radio } from "@mui/material";


export default function ApiMetadataFields(props) {
  const { selectedApi, metadata, setMetadata } = props;

  return (
    <Grid>
      {selectedApi !== undefined && selectedApi.name.includes("Rebrickable") && (<RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={metadata}
        onChange={(e) => {
          setMetadata(e.target.value);
        }}
      >
        <Grid item ml={2}>
          <FormControlLabel
            value="sets"
            control={<Radio />}
            label="Sets"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="minifigs"
            control={<Radio />}
            label="Minifigs"
          />
        </Grid>
      </RadioGroup>)}
      {selectedApi !== undefined && selectedApi.name.includes("Gijoe") && (<RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={metadata}
        onChange={(e) => {
          setMetadata(e.target.value);
        }}
      >
        <Grid item ml={2}>
          <FormControlLabel
            value="classified"
            control={<Radio />}
            label="Classified Series"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="retro"
            control={<Radio />}
            label="Retro Collection"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="classic"
            control={<Radio />}
            label="Classic Collection"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="ultimates"
            control={<Radio />}
            label="Super7 Ultimates"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="reaction"
            control={<Radio />}
            label="Super7 ReAction"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="25"
            control={<Radio />}
            label="25 Anniversary"
          />
        </Grid>
      </RadioGroup>)}
      {selectedApi !== undefined && selectedApi.name.includes("Marvel Legends") && (<RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={metadata}
        onChange={(e) => {
          setMetadata(e.target.value);
        }}
      >
        <Grid item ml={2}>
          <FormControlLabel
            value="baf"
            control={<Radio />}
            label="BAFS"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="set"
            control={<Radio />}
            label="Sets"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="exclusives"
            control={<Radio />}
            label="Exclusives"
          />
        </Grid>
      </RadioGroup>)}
      {selectedApi !== undefined && selectedApi.name.includes("MOTU") && (<RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={metadata}
        onChange={(e) => {
          setMetadata(e.target.value);
        }}
      >
        <Grid item ml={2}>
          <FormControlLabel
            value="origins"
            control={<Radio />}
            label="Origins"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="original"
            control={<Radio />}
            label="Original"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="classics"
            control={<Radio />}
            label="Classics"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="masterverse"
            control={<Radio />}
            label="Masterverse"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="super7"
            control={<Radio />}
            label="Super7"
          />
        </Grid>
      </RadioGroup>)}
      {selectedApi !== undefined && selectedApi.name.includes("Star Wars") && (<RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={metadata}
        onChange={(e) => {
          setMetadata(e.target.value);
        }}
      >
        <Grid item ml={2}>
          <FormControlLabel
            value="vintage"
            control={<Radio />}
            label="Vintage Collection"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="black"
            control={<Radio />}
            label="Black Series"
          />
        </Grid>
      </RadioGroup>)}
      {selectedApi !== undefined && selectedApi.name.includes("TMNT") && (<RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={metadata}
        onChange={(e) => {
          setMetadata(e.target.value);
        }}
      >
        <Grid item ml={2}>
          <FormControlLabel
            value="neca"
            control={<Radio />}
            label="Neca"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="super7"
            control={<Radio />}
            label="Super7"
          />
        </Grid>
        <Grid item ml={2}>
          <FormControlLabel
            value="playmates"
            control={<Radio />}
            label="Playmates"
          />
        </Grid>
      </RadioGroup>)}
    </Grid>
  );
}