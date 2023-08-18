import { Box, Typography } from "@mui/material";

export default function Copyright(props) {
  return (
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        Collectoryx {new Date().getFullYear()} - Version 1.5.5
        {"."}
      </Typography>
    </Box>
  );
}
