import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

export default function BlogCard({ title, content }) {
  const [open, setOpen] = useState(false);

  // Create excerpt from content
  const excerpt =
    content.length > 60 ? content.substring(0, 60) + "..." : content;

  return (
    <>
      {/* ==== BLOG PREVIEW CARD ==== */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {excerpt}
          </Typography>

          <CardActions>
            <Button size="small" onClick={() => setOpen(true)}>
              Read More
            </Button>
          </CardActions>
        </CardContent>
      </Card>

      {/* ==== MODAL FOR FULL BLOG ==== */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {title}
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}
          >
            {content}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
