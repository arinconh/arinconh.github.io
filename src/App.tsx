import { Helmet } from "react-helmet-async";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { Publications } from "./components/Publications";
import { Talks } from "./components/Talks";
import { Recent } from "./components/Recent";
import { Languages } from "./components/Languages";
import { Footer } from "./components/Footer";
import { bio } from "./content/bio";

export default function App() {
  const description = bio.positioning;
  return (
    <>
      <Helmet>
        <title>{`${bio.name} — Senior Data Scientist`}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${bio.name} — Senior Data Scientist`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/portrait.jpg" />
        <meta property="og:url" content="https://arinconh.github.io/" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://arinconh.github.io/" />
      </Helmet>
      <Nav />
      <Hero />
      <About />
      <Expertise />
      <Publications />
      <Talks />
      <Recent />
      <Languages />
      <Footer />
    </>
  );
}
