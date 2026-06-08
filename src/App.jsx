import React, { useState } from "react";
import {
  CssBaseline,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Link as MuiLink,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Fab,
} from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  GitHub,
  Instagram,
  LinkedIn,
  Mail,
  Menu as MenuIcon,
} from "@mui/icons-material";

import ThemeSwitcher from "./components/ThemeSwitcher";
import Home from "./pages/Home";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const paletteDark = {
    mode: "dark",
    primary: { main: "#64ffda" },
    background: { default: "#0a192f", paper: "#112240" },
    text: { primary: "#ccd6f6", secondary: "#8892b0" },
  };

  const paletteLight = {
    mode: "light",
    primary: { main: "#00796b" },
    background: { default: "#f9f9f9", paper: "#ffffff" },
    text: { primary: "#1f2937", secondary: "#6b7280" },
  };

  const theme = createTheme({
    palette: darkMode ? paletteDark : paletteLight,
    typography: {
      fontFamily: "'Inter','Roboto','Helvetica','Arial',sans-serif",
      h3: { fontWeight: 700, letterSpacing: "-0.03em" },
      h4: { fontWeight: 600 },
      body1: { lineHeight: 1.7 },
    },
    shape: { borderRadius: 12 },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* CLEAN SOLID BACKGROUND */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          backgroundColor: theme.palette.background.default,
        }}
      />

      {/* LEFT SOCIALS (DESKTOP ONLY) */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 1.5,
            }}
          >
            <IconButton
              component={MuiLink}
              href="https://github.com/szabi-vaida"
              target="_blank"
              sx={{ color: theme.palette.primary.main }}
            >
              <GitHub />
            </IconButton>

            <IconButton
              component={MuiLink}
              href="https://www.linkedin.com/in/szabolcs-levente-vaida-336457214/"
              target="_blank"
              sx={{ color: theme.palette.primary.main }}
            >
              <LinkedIn />
            </IconButton>

            <IconButton
              component={MuiLink}
              href="https://www.instagram.com/szabi.vaida/"
              target="_blank"
              sx={{ color: theme.palette.primary.main }}
            >
              <Instagram />
            </IconButton>
          </Box>

          <Box
            sx={{
              width: "2px",
              height: "120px",
              backgroundColor: theme.palette.primary.main,
              opacity: 0.4,
            }}
          />
        </Box>
      )}

      {/* RIGHT EMAIL (DESKTOP ONLY) */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            right: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MuiLink
            href="mailto:contact@szabivaida.dev"
            sx={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              color: theme.palette.primary.main,
              letterSpacing: "1px",
              fontSize: "0.85rem",
              mb: 1.5,
              opacity: 0.75,
            }}
          >
            contact@szabivaida.dev
          </MuiLink>

          <Box
            sx={{
              width: "2px",
              height: "120px",
              backgroundColor: theme.palette.primary.main,
              opacity: 0.4,
            }}
          />
        </Box>
      )}

      {/* MOBILE CONTACT BUTTON */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            bgcolor: theme.palette.primary.main,
            color: "#0a192f",
            "&:hover": {
              bgcolor: theme.palette.primary.main,
              opacity: 0.85,
            },
          }}
        >
          <MenuIcon />
        </Fab>
      )}

      {/* MOBILE DRAWER MENU */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "260px",
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            p: 2,
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Contact / Socials
        </Typography>

        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="mailto:contact@szabivaida.dev">
              <ListItemIcon>
                <Mail sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary="Email" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="https://github.com/szabi-vaida"
              target="_blank"
            >
              <ListItemIcon>
                <GitHub sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary="GitHub" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="https://www.linkedin.com/in/szabolcs-levente-vaida-336457214/"
              target="_blank"
            >
              <ListItemIcon>
                <LinkedIn sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary="LinkedIn" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="https://www.instagram.com/szabi.vaida/"
              target="_blank"
            >
              <ListItemIcon>
                <Instagram sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary="Instagram" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* NAVBAR */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          width: "100%",
          zIndex: 10,
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          py: 1.5,
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            px: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: theme.palette.primary.main }}
          >
            Szabi Vaida
          </Typography>

          <ThemeSwitcher
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </Box>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          maxWidth: "1100px",
          mx: "auto",
          px: { xs: 2, sm: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Home />
      </Box>
    </ThemeProvider>
  );
}
