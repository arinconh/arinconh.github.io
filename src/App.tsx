import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { Publications } from "./components/Publications";
import { Talks } from "./components/Talks";

export default function App() {
  return (
    <>
      <Hero />
      <About />
      <Expertise />
      <Publications />
      <Talks />
    </>
  );
}
