import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
} from "@mui/material";
import { Close, ArrowForward } from "@mui/icons-material";

export default function BlogCard({ title, content, created_at }) {
  const [open, setOpen] = useState(false);

  const excerpt = content.length > 160 ? content.substring(0, 160).trimEnd() + "…" : content;

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Card
        sx={{
          width: "100%",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 8,
          },
        }}
      >
        <CardContent sx={{ flex: 1, p: { xs: 2.5, sm: 3 } }}>
          {formattedDate && (
            <Typography
              variant="caption"
              color="primary"
              sx={{ fontWeight: 600, letterSpacing: "0.05em", mb: 1, display: "block" }}
            >
              {formattedDate}
            </Typography>
          )}

          <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
            {excerpt}
          </Typography>

          <Button
            size="small"
            endIcon={<ArrowForward fontSize="small" />}
            onClick={() => setOpen(true)}
            sx={{ textTransform: "none", fontWeight: 600, p: 0 }}
          >
            Read more
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
          {title}
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{ position: "absolute", top: 12, right: 12 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {formattedDate && (
            <Typography
              variant="caption"
              color="primary"
              sx={{ fontWeight: 600, letterSpacing: "0.05em", mb: 2, display: "block" }}
            >
              {formattedDate}
            </Typography>
          )}
          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}
          >
            {content}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
