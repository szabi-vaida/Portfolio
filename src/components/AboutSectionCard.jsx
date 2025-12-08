import React from "react";
import { Box, Typography, Divider, Paper, Grid } from "@mui/material";
import useFadeInOnScroll from "../hooks/useFadeInOnScroll";

export default function AboutSectionsCard({ sections }) {
  const { ref, visible } = useFadeInOnScroll();

  return (
    <Paper
      ref={ref}
      elevation={4}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        bgcolor: "background.paper",
        maxWidth: "1200px",
        mx: "auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(25px)",
        transition: "all 0.8s ease",
      }}
    >
      <Grid container spacing={6}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "primary.main", mb: 2 }}
            >
              {section.title}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography component="ul" sx={{ pl: 2, lineHeight: 1.8 }}>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
