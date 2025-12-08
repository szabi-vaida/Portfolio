import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";

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

  // ================= FETCH DATA FROM SUPABASE =================
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

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4, md: 6 },
          mt: { xs: 2, md: 4 },
          mb: 12,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 4, md: 6 },
          borderRadius: 4,
          bgcolor: "background.paper",
          maxWidth: "1100px",
          mx: "auto",
        }}
      >
        <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Szabi Vaida
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Full Stack Developer • Sheffield, United Kingdom
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body1" sx={{ mb: 2 }}>
            I'm a Full Stack Developer currently working at Clear Links
            Technologies, building tools that improve UK student support.
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Below you’ll find my skills, projects, interests, and visions.
          </Typography>
        </Box>

        <Avatar
          src="images/title_photo.jpg"
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

      {/* ================= ABOUT SECTIONS – BIG CARD ================= */}
      <Box sx={{ my: 10 }}>
        <AboutSectionsCard
          sections={[
            {
              title: "Life so far",
              items: [
                "Born in 1996",
                "Studied Computer Science for Games (2019)",
                "QA Tester (2021–2022)",
                "Developer at Clear Links Technologies (2022–present)",
              ],
            },
            {
              title: "Visions of the Future",
              items: [
                "Never stop learning",
                "Grow as a developer & engineer",
                "Create a meaningful game",
                "Contribute positively to society",
              ],
            },
            {
              title: "Interests",
              items: [
                "Average music listener and creator",
                "Cooking & baking",
                "Gaming (boardgames + video games)",
                "Hiking & camping",
              ],
            },
          ]}
        />
      </Box>

      {/* ================= SKILLS ================= */}
      <Section title="Skills">
        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: "1100px",
            mx: "auto",
            justifyContent: "center",
          }}
        >
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

      {/* ================= PROJECTS ================= */}
      <Section title="Projects">
        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: "1100px",
            mx: "auto",
            justifyContent: "center",
            alignItems: "stretch",
          }}
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

     {/* ================= BLOG ================= */}
        <Section title="Mini-Blog">
        <Grid
            container
            spacing={4}
            sx={{
            maxWidth: "1100px",
            mx: "auto",
            justifyContent: "center",
            alignItems: "stretch",
            }}
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

      {/* ================= FOOTER ================= */}
      <Box mt={12} py={4} textAlign="center" color="text.secondary">
        <Typography variant="body2">© 2025 Szabi Vaida</Typography>
      </Box>
    </>
  );
}
