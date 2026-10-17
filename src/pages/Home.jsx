import React from "react";
import { Grid, Typography, Box, Avatar, Divider, Paper } from "@mui/material";

import Section from "../components/Section";
import AboutSectionsCard from "../components/AboutSectionCard";
import SkillOrb from "../components/SkillOrb";
import BlogCard from "../components/BlogCard";

import { skills, blog } from "../data/portfolioData";

export default function Home() {
  const sortedBlog = [...blog]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    <>
      {/* ================= HERO ================= */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5, md: 6 },
          mt: { xs: 2, md: 4 },
          mb: 2,
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 3, md: 6 },
          borderRadius: 4,
        }}
      >
        <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
          >
            Szabi Vaida
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Full-Stack Developer · Sheffield, UK
          </Typography>

          <Divider sx={{ my: 2.5 }} />

          <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
            I'm a Full-Stack Developer at Clear Links Technologies, building and
            maintaining web applications across multiple domains — student support,
            a job board platform, and finance systems.
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            My background includes professional QA work (part-time while studying),
            which sharpened my attention to detail, testing mindset, and ability to
            ship reliable software.
          </Typography>
        </Box>

        <Avatar
          src="/images/title_photo.jpg"
          alt="Szabi Vaida"
          sx={{
            width: { xs: 140, sm: 180, md: 240 },
            height: { xs: 140, sm: 180, md: 240 },
            boxShadow: 6,
            flexShrink: 0,
            border: "3px solid",
            borderColor: "primary.main",
          }}
        />
      </Paper>

      {/* ================= ABOUT ================= */}
<<<<<<< HEAD
      <Box sx={{ ...containerSx, my: 6 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={12}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Box sx={{ width: "100%" }}>
                <AboutSectionsCard
                  sections={[
                    {
                      title: "Focus",
                      items: [
                        "Building user-focused, reliable software",
                        "Working across disciplines and domains (platforms, job boards, finance)",
                        "Continuous learning and improving engineering practices",
                      ],
                    },
                  ]}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Box sx={{ width: "100%" }}>
                <AboutSectionsCard
                  sections={[
                    {
                      title: "Experience Snapshot",
                      items: [
                        "Full-Stack Developer — Clear Links Technologies (2022–present)",
                        "QA Tester (part-time) — Proper QA (2022-)",
                        "Self-Employed Programming Tutor (Freelance) (2022-)",
                        "BSc: Computer Science for Games",
                      ],
                    },
                  ]}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
=======
      <Section title="About">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1, display: "flex" }}>
            <AboutSectionsCard
              sections={[
                {
                  title: "Experience",
                  items: [
                    "Full-Stack Developer — Clear Links Technologies (2022–present)",
                    "QA Tester (part-time) — Proper QA (2022–)",
                    "Self-Employed Programming Tutor (2022–)",
                    "BSc: Computer Science for Games",
                  ],
                },
              ]}
            />
          </Box>
>>>>>>> c4dd6e04cc7952fab5503e9427492ba54d4d8b8a

          <Box sx={{ flex: 1, display: "flex" }}>
            <AboutSectionsCard
              sections={[
                {
                  title: "Focus",
                  items: [
                    "Building user-focused, reliable software",
                    "Working across disciplines and domains",
                    "Continuous learning and improving engineering practices",
                  ],
                },
              ]}
            />
          </Box>
        </Box>
      </Section>

      {/* ================= SKILLS ================= */}
      <Section title="Skills">
        <Grid container spacing={3} justifyContent="center">
          {skills.map((skill) => (
            <Grid
              item
              xs={3}
              sm={2}
              md={2}
              key={skill.id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <SkillOrb name={skill.name} icon={skill.icon} link={skill.link} />
            </Grid>
          ))}
        </Grid>
      </Section>

{/* ================= BLOG ================= */}
      <Section title="Writing">
        <Grid container spacing={3} alignItems="stretch">
          {sortedBlog.map((b) => (
            <Grid item xs={12} md={6} key={b.id} sx={{ display: "flex" }}>
              <BlogCard title={b.title} content={b.content} created_at={b.created_at} />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* ================= FOOTER ================= */}
      <Box mt={10} py={4} textAlign="center" color="text.secondary">
        <Typography variant="body2">© {new Date().getFullYear()} Szabi Vaida</Typography>
      </Box>
    </>
  );
}
