import React from "react";
import { Switch, Typography, Box } from "@mui/material";

export default function ThemeSwitcher({ checked, onChange }) {
  return (
    <Box display="flex" alignItems="center">
      <Switch checked={checked} onChange={onChange} />
      <Typography ml={1}>Light / Dark</Typography>
    </Box>
  );
}
