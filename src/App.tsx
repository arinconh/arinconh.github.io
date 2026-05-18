import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { Publications } from "./components/Publications";
import { Talks } from "./components/Talks";
import { Recent } from "./components/Recent";
import { Languages } from "./components/Languages";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
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
