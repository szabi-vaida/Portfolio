import React from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";
import useFadeInOnScroll from "../hooks/useFadeInOnScroll";

export default function AboutSectionsCard({ sections }) {
  const { ref, visible } = useFadeInOnScroll();

  return (
    <Paper
      ref={ref}
      elevation={3}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        bgcolor: "background.paper",
        height: "100%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(25px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {sections.map((section, index) => (
        <Box key={index} sx={{ mb: index < sections.length - 1 ? 4 : 0 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "primary.main", mb: 1.5 }}
          >
            {section.title}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
            {section.items.map((item) => (
              <Box
                component="li"
                key={item}
                sx={{ mb: 0.75, color: "text.secondary", lineHeight: 1.7 }}
              >
                <Typography variant="body2">{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Paper>
  );
}
