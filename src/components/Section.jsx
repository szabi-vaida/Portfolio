import React from "react";
import { Typography, Box, Divider } from "@mui/material";

export default function Section({ title, children }) {
  return (
    <Box my={6}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );
}
