import React from "react";
import { Box } from "@mui/material";
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
        width: 90,
        height: 90,
        borderRadius: "50%",
        overflow: "hidden",
        cursor: "pointer",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: `
          0 4px 10px rgba(0,0,0,0.3),
          inset 0 0 12px rgba(255,255,255,0.12)
        `,

        transformStyle: "preserve-3d",
        transition: "all 0.6s ease",

        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.9)",

        "&:hover": {
          transform:
            "translateY(-6px) scale(1.05) rotateX(8deg) rotateY(8deg)",
          boxShadow: `
            0 8px 20px rgba(0,0,0,0.45),
            inset 0 0 16px rgba(255,255,255,0.18)
          `,
        },
      }}
    >
      <Box
        component="img"
        src={icon}
        alt={name}
        sx={{
          width: 48,
          height: 48,
          pointerEvents: "none",
          filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))",
          transform: "translateZ(20px)",
        }}
      />
    </Box>
  );
}
