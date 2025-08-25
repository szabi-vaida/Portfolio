import React, { useState } from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Home from "./pages/Home";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#1976d2" }, // blue
      secondary: { main: "#ff4081" }, // pink
      background: {
        default: darkMode ? "#0d0d0d" : "#f9f9f9", // subtle bg
        paper: darkMode ? "#1a1a1a" : "#ffffff",   // cards, sections
      },
    },
    typography: {
      fontFamily: "'Roboto','Helvetica','Arial',sans-serif",
      h3: { fontWeight: 700, letterSpacing: "-0.5px" },
      h5: { fontWeight: 400 },
      body1: { lineHeight: 1.7 },
    },
    shape: { borderRadius: 12 },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Header / Nav */}
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: "blur(12px)",
          borderBottom: 1,
          borderColor: "divider",
          px: { xs: 2, md: 6 }, // responsive padding
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Szabi Vaida
          </Typography>
          <ThemeSwitcher
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content – full width but with nice responsive padding */}
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 6 }, // full width, but padded nicely
        }}
      >
        <Container maxWidth={false} disableGutters>
          <Home />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
