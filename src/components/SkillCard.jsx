import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

export default function SkillCard({ name, icon, link }) {
  return (
    <Card
      component="a"
      href={link}
      target="_blank"
      sx={{
        textAlign: "center",
        textDecoration: "none",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
      }}
    >
      <CardContent>
        <CardMedia component="img" image={icon} alt={name} sx={{ width: 64, mx: "auto" }} />
        <Typography mt={2} fontWeight="bold">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
}
