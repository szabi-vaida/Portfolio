import type { SectionType } from '@forge/schema';
import About from './About.astro';
import BlogList from './BlogList.astro';
import ContactForm from './ContactForm.astro';
import Cta from './Cta.astro';
import Faq from './Faq.astro';
import Features from './Features.astro';
import Gallery from './Gallery.astro';
import Hero from './Hero.astro';
import LogoCloud from './LogoCloud.astro';
import Map from './Map.astro';
import Marquee from './Marquee.astro';
import Menu from './Menu.astro';
import Newsletter from './Newsletter.astro';
import OpeningHours from './OpeningHours.astro';
import Pricing from './Pricing.astro';
import ProductGrid from './ProductGrid.astro';
import Projects from './Projects.astro';
import Stats from './Stats.astro';
import Steps from './Steps.astro';
import Team from './Team.astro';
import Testimonials from './Testimonials.astro';
import Text from './Text.astro';
import Timeline from './Timeline.astro';
import Video from './Video.astro';

/** One component per section type. A missing entry fails the type check. */
export const SECTIONS: Record<SectionType, unknown> = {
  hero: Hero,
  features: Features,
  steps: Steps,
  gallery: Gallery,
  pricing: Pricing,
  testimonials: Testimonials,
  faq: Faq,
  cta: Cta,
  'contact-form': ContactForm,
  'product-grid': ProductGrid,
  menu: Menu,
  team: Team,
  stats: Stats,
  'logo-cloud': LogoCloud,
  'blog-list': BlogList,
  about: About,
  'opening-hours': OpeningHours,
  projects: Projects,
  timeline: Timeline,
  map: Map,
  video: Video,
  text: Text,
  newsletter: Newsletter,
  marquee: Marquee,
};
