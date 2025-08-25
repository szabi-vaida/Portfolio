import React from "react";
import { Grid, Typography, Box, Avatar, Link, IconButton, Divider } from "@mui/material";
import { LinkedIn, Instagram, GitHub, History, Whatshot, Rocket } from "@mui/icons-material";

import Section from "../components/Section";
import SkillCard from "../components/SkillCard";
import ProjectCard from "../components/ProjectCard";
import BlogCard from "../components/BlogCard";

import skills from "../data/skills";
import projects from "../data/projects";
import blog from "../data/blog";

export default function Home() {
  return (
    <>
      {/* Hero / About */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        mb={8}
      >
        <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Szabi Vaida
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Personal Website
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            About Me
          </Typography>
          <Typography paragraph>
            My name is Szabi Vaida, and I'm a Full Stack Developer. I live in Sheffield, United Kingdom, and I am employed at Clear Links Technologies, where we strive to provide the best student support services as our primary focus, occasionally venturing into other realms of tech.
          </Typography>
          <Typography paragraph>
            On this page, you can find information about me, the projects I’ve worked on, and my interests.
            You can also find me on:
          </Typography>
          <Box>
            <IconButton
              component={Link}
              href="https://www.linkedin.com/in/szabolcs-levente-vaida-336457214/"
              target="_blank"
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              component={Link}
              href="https://www.instagram.com/szabi.vaida/"
              target="_blank"
            >
              <Instagram />
            </IconButton>
            <IconButton
              component={Link}
              href="https://github.com/szabi-vaida"
              target="_blank"
            >
              <GitHub />
            </IconButton>
          </Box>
        </Box>

        <Box mt={{ xs: 4, md: 0 }}>
          <Avatar
            src="images/title_photo.jpg"
            alt="Szabi Vaida"
            sx={{
              width: 256,
              height: 256,
              boxShadow: 6,
              borderRadius: "50%",
            }}
          />
        </Box>
      </Box>

      {/* Life, Interests, Visions */}
      <Grid container spacing={3} mb={8}>
        <Grid item xs={12} md={4}>
          <Section title="Life so far...">
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>Born in 1996</li>
              <li>Studied Computer Science for Games in 2019</li>
              <li>Worked as a tester (2021–2022)</li>
              <li>Started at Clear Links Technologies in 2022</li>
            </Typography>
          </Section>
        </Grid>
        <Grid item xs={12} md={4}>
          <Section title="Interests...">
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>Music & production</li>
              <li>Cooking and baking</li>
              <li>Games (video + board)</li>
              <li>Hiking and camping</li>
              <li>Reading</li>
            </Typography>
          </Section>
        </Grid>
        <Grid item xs={12} md={4}>
          <Section title="Visions of the future...">
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>Never stop learning</li>
              <li>Grow as a developer/engineer</li>
              <li>Develop a game that brings joy</li>
              <li>Contribute positively to society</li>
            </Typography>
          </Section>
        </Grid>
      </Grid>

      {/* Skills */}
      <Section title="My Skills">
        <Grid container spacing={3}>
          {skills.map((s) => (
            <Grid item xs={6} sm={4} md={2} key={s.name}>
              <SkillCard {...s} />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Projects */}
      <Section title="Projects">
        {projects.map((p) => (
          <ProjectCard key={p.title} {...p} />
        ))}
      </Section>

      {/* Blog */}
      <Section title="Blog">
        {blog.map((b) => (
          <BlogCard key={b.title} {...b} />
        ))}
      </Section>

      {/* Footer */}
      <Box mt={8} py={4} borderTop={1} borderColor="divider" textAlign="center">
        <Typography variant="body2" color="text.secondary">
          © 2024 Szabi Vaida
        </Typography>
      </Box>
    </>
  );
}
