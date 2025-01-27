import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
import Navbar from "./component/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import SocialAcc from "./pages/SocialAcc";
import Products from "./pages/Projects/Products";
import Experience from "./pages/Experience";
import heroBg from "./assets/hero.jpg";
import { Github } from "./pages/Github/Github";
import { Expertise } from "./pages/Expertise/Expertise";
import { Resume } from "./pages/Resume/Resume";

function App() {
  const bgImageStyle = {
    backgroundImage: `url(${heroBg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };
  const bgImageStyleNoCenter = {
    backgroundImage: `url(${heroBg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <Router>
      <div className="relative z-0 bg-primary bg-cover bg-no-repeat bg-center">
        {/* Navbar and Hero section */}
        <div style={bgImageStyle}>
          <Navbar />
        </div>

        <div style={bgImageStyleNoCenter}>
          {/* All components will be shown on the main route */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <About />
                  <Expertise />
                  <Products />
                  <Experience />
                  <Github />
                  <SocialAcc />
                </>
              }
            />
            {/* About route */}
            <Route path="/about" element={<About />} />
            <Route path="/stack" element={<Expertise />} />
            <Route path="/project" element={<Products />} />
            <Route path="/contact" element={<SocialAcc />} />
            <Route path="/resume" element={<Resume />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
