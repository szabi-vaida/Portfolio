import React from "react";
import { Typography, Box } from "@mui/material";

export default function Section({ title, children }) {
  return (
    <Box my={10}>

      {/* ==== CLEAN CENTERED HEADER WITH INTEGRATED DIVIDER ==== */}
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          mb: 6,
        }}
      >
        {/* Divider line */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 2,
            bgcolor: "text.secondary",
            opacity: 0.25,
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        />

        {/* Section Title */}
        <Typography
          variant="h4"
          sx={{
            position: "relative",
            zIndex: 2,
            px: 3,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "text.primary",
            backgroundColor: "background.default",
            display: "inline-block",
            borderRadius: 0.5,
          }}
        >
          {title}
        </Typography>
      </Box>

      {children}
    </Box>
  );
}
