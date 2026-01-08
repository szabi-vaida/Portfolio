import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, Avatar, Divider, Paper } from "@mui/material";

import Section from "../components/Section";
import AboutSectionsCard from "../components/AboutSectionCard";
import SkillOrb from "../components/SkillOrb";
import ProjectCard from "../components/ProjectCard";
import BlogCard from "../components/BlogCard";

import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: skillsData } = await supabase.from("skills").select("*");
      const { data: projectsData } = await supabase.from("projects").select("*");
      const { data: blogData } = await supabase.from("blog").select("*");

      setSkills(skillsData || []);
      setProjects(projectsData || []);
      setBlog(blogData || []);
    }

    loadData();
  }, []);

  const containerSx = {
    maxWidth: "1100px",
    mx: "auto",
    px: { xs: 2, sm: 0 },
  };

  const aboutStackSx = {
    ...containerSx,
    maxWidth: "900px", 
  };

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <Box sx={containerSx}>
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            mt: { xs: 2, md: 4 },
            mb: 8,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 4, md: 6 },
            borderRadius: 4,
            bgcolor: "background.paper",
          }}
        >
          <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Szabi Vaida
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              Full-Stack Developer • Sheffield, United Kingdom
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              I’m a Full-Stack Developer at Clear Links Technologies, building and
              maintaining web applications across multiple domains, including
              student support, a job board platform, and finance systems.
            </Typography>

            <Typography variant="body1" sx={{ mb: 0 }}>
              My background includes professional QA work (part-time while studying
              development), which strengthened my attention to detail, testing
              mindset, and ability to ship reliable software.
            </Typography>
          </Box>

          <Avatar
            src="/images/title_photo.jpg"
            alt="Szabi Vaida"
            sx={{
              width: { xs: 180, md: 260 },
              height: { xs: 180, md: 260 },
              boxShadow: 6,
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
        </Paper>
      </Box>

      {/* ================= ABOUT ================= */}
      <Box sx={{ ...containerSx, my: 6 }}>
        <Grid container spacing={3} justifyContent="center">
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
        </Grid>
      </Box>


      {/* ================= SKILLS ================= */}
      <Box sx={containerSx}>
        <Section title="Skills">
          <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            {skills.map((skill) => (
              <Grid
                item
                xs={4}
                sm={3}
                md={2}
                key={skill.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <SkillOrb name={skill.name} icon={skill.icon} link={skill.link} />
              </Grid>
            ))}
          </Grid>
        </Section>
      </Box>

      {/* ================= PROJECTS ================= */}
      <Box sx={containerSx}>
        <Section title="Projects">
          <Grid
            container
            spacing={4}
            sx={{ justifyContent: "center", alignItems: "stretch" }}
          >
            {projects.map((p) => (
              <Grid
                item
                xs={12}
                sm={10}
                md={8}
                lg={6}
                key={p.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ProjectCard {...p} />
              </Grid>
            ))}
          </Grid>
        </Section>
      </Box>

      {/* ================= BLOG ================= */}
      <Box sx={containerSx}>
        <Section title="Writing">
          <Grid
            container
            spacing={4}
            sx={{ justifyContent: "center", alignItems: "stretch" }}
          >
            {blog
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 3)
              .map((b) => (
                <Grid
                  item
                  xs={12}
                  sm={10}
                  md={8}
                  lg={6}
                  key={b.id}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <BlogCard title={b.title} content={b.content} />
                </Grid>
              ))}
          </Grid>
        </Section>
      </Box>

      {/* ================= FOOTER ================= */}
      <Box mt={10} py={4} textAlign="center" color="text.secondary">
        <Typography variant="body2">© 2025 Szabi Vaida</Typography>
      </Box>
    </>
  );
}
