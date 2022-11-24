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
            value="sets"
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
    </Grid>
  );
}