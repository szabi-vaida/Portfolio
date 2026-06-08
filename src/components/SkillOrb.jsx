import React from "react";
import { Box, Typography } from "@mui/material";
import useFadeInOnScroll from "../hooks/useFadeInOnScroll";

export default function SkillOrb({ name, icon, link }) {
  const { ref, visible } = useFadeInOnScroll();

  return (
    <Box
      ref={ref}
      component="a"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        textDecoration: "none",
        "&:hover .orb": {
          transform: "translateY(-5px) scale(1.08)",
          boxShadow: 8,
        },
      }}
    >
      <Box
        className="orb"
        sx={{
          width: { xs: 70, sm: 80 },
          height: { xs: 70, sm: 80 },
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 2,
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        <Box
          component="img"
          src={icon}
          alt={name}
          sx={{
            width: { xs: 36, sm: 42 },
            height: { xs: 36, sm: 42 },
            pointerEvents: "none",
          }}
        />
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 600, fontSize: "0.7rem" }}
      >
        {name}
      </Typography>
    </Box>
  );
}
