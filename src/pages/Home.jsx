import { Hero } from "../sections/Hero";
import { Work } from "../sections/Work";
import { Experience, Method, Stack } from "../sections/Profile";
import { Beyond, Contact, GitHub } from "../sections/Closing";

// Notes stay out until it has real content. Projects live at /projects.
export default function Home() {

  return (
    <>
      <Hero />
      <Work />
      <Method />
      <Stack />
      <Experience />
      <GitHub />
      <Beyond />
      <Contact />
    </>
  );
}
