import React from "react";
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";

export default function BlogCard({ title, excerpt, link }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {excerpt}
        </Typography>
        <CardActions>
          <Button size="small" href={link} target="_blank">Read More</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}
