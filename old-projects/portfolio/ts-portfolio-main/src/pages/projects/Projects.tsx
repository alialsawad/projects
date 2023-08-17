import Retro from "assets/projects/retro.jpg";
import Dragon from "assets/projects/dragon.jpg";
import Www from "assets/projects/www.jpg";
import ImageProcessing from "assets/projects/wasm.png";
import { Meta } from "components/Meta";

import dynamic from "next/dynamic";
import { Fragment } from "react";
import { media } from "utils/style";
import { ProjectDisplay } from "./ProjectDisplay";

const Carousel = dynamic(() =>
  import("components/Carousel").then((mod) => mod.Carousel)
);

const title = "Projects";
const description = "Overview of the projects I've done.";

export function Projects() {
  if (!Carousel) {
    return null;
  }
  return (
    <Fragment>
      <Meta title={title} prefix="Projects" description={description} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-theme='dark'] {
              --rgbPrimary: 240 211 150;
              --rgbAccent: 240 211 150;
            }
            [data-theme='light'] {
              --rgbPrimary: 134 99 23;
              --rgbAccent: 134 99 23;
            }
          `,
        }}
      />

      <Carousel
        images={[
          {
            srcSet: [ImageProcessing],
            sizes: `(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 100vw, 1096px`,
            alt: "WebAssembly Image Processing Project Background",
            content: (
              <ProjectDisplay
                title="Advanced Image Processing"
                url="https://fullstack-in-production.vercel.app/"
                stack={["Rust", "TypeScript", "WebAssembly"]}
                shortDescription={
                  "Efficient image processing using Rust and WebAssembly"
                }
                description={[
                  `This project showcases an efficient image processing application built with Rust and WebAssembly.`,
                ]}
              />
            ),
          },
          {
            srcSet: [Retro],
            sizes: `(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 100vw, 1096px`,
            alt: "Background Image for Portfolio project",
            content: (
              <ProjectDisplay
                title="Portfolio"
                url={"https://alialsawad.com/projects/"}
                showLink={false}
                stack={[
                  "TypeScript",
                  "Next.js",
                  "Three.js",
                  "GLSL",
                  "Framer motion",
                ]}
                shortDescription={
                  "Explore my portfolio website and experience the projects I've worked on, powered by the latest web technologies."
                }
              />
            ),
          },
          {
            srcSet: [Dragon],
            sizes: `(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 100vw, 1096px`,
            alt: "Background Image for KJE project",
            content: (
              <ProjectDisplay
                title="KJE"
                url={"https://kje-frontend.vercel.app/"}
                stack={[
                  "React",
                  "Django",
                  "Natural language processing",
                  "PostgreSQL",
                  "Web scraping",
                  "Web speech API",
                ]}
                description={[
                  `Improve your language skills with KJE, a website that provides real-time speech recognition and validation with Web Speech API.`,
                  `Explore over 12,000 English translated Korean and Japanese sentences and use Natural Language Processing to enhance your understanding of the language.`,
                ]}
                shortDescription={
                  "Improve your Korean and Japanese language skills with KJE's interactive and innovative features."
                }
              />
            ),
          },
          {
            srcSet: [Www],
            sizes: `(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 100vw, 1096px`,
            alt: "Background Image for Remo project",
            content: (
              <ProjectDisplay
                title="Remo"
                url={
                  "https://www.youtube.com/watch?v=ItAliIWfbik&list=PL8DaYTcPRBbS-qrVt0BEMYt1ZIUZDkig4&index=6&ab_channel=HooverInstitution"
                }
                stack={["React", "Django", "SQLite", "Remotive API"]}
                description={[
                  "Discover remote job opportunities with Remo, a dedicated remote jobs aggregator.",
                  "Create a Markdown-styled profile and showcase your skills to potential employers.",
                ]}
                shortDescription={
                  "Find remote job opportunities with Remo's comprehensive job board and advanced search features."
                }
              />
            ),
          },
        ]}
        width={1920}
        height={1080}
      />
    </Fragment>
  );
}
