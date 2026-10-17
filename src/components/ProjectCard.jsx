import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { OpenInNew } from "@mui/icons-material";

export default function ProjectCard({ title, description, image, link }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      {image && (
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            width: { xs: "100%", sm: 220 },
            height: { xs: 200, sm: "auto" },
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      )}

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 2.5, sm: 3 },
          flex: 1,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {description}
          </Typography>
        </Box>

        {link && (
          <Box mt={2.5}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              endIcon={<OpenInNew fontSize="small" />}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              View Project
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
