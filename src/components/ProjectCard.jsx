import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

export default function ProjectCard({ title, description, image, link }) {
  return (
    <Card sx={{ display: "flex", mb: 3 }}>
      <CardMedia
        component="img"
        sx={{ width: 200 }}
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
        <Typography>
          <a href={link} target="_blank" rel="noopener noreferrer">
            View Project
          </a>
        </Typography>
      </CardContent>
    </Card>
  );
}
