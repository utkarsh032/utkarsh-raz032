import { Link as ScrollLink } from "react-scroll"; // Import for scrolling
import { Link as RouterLink } from "react-router-dom"; // Import for routing
import { useEffect, useState } from "react";

const Navbar = () => {
  const navLinks = [
    { to: "about", label: "About" },
    { to: "stack", label: "Tech&Stack" },
    { to: "education", label: "Education" },
    { to: "project", label: "Project" },
    { to: "contact", label: "Contact" }
  ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full shadow-xl items-center fixed top-0 z-20 text-white transition-all duration-500 ${scrolled
        ? "backdrop-blur-xl bg-black/60 border-b border-gray-700"
        : "bg-transparent"
        }`}
    >
      <div className="w-full max-w-7xl mx-auto px-2 py-3">
        <div className="flex justify-between items-center">
          {/* Smooth Scroll Link */}
          <ScrollLink
            to="hero"
            smooth={true}
            duration={500}
            className="text-3xl font-bold flex items-center gap-2 hover:text-gray-300 transition-all duration-500 cursor-pointer"
          >
            Utkarsh
            <p className="animate-bounce bg-[#A11143] w-3 h-3 rounded-full inline-block"></p>
          </ScrollLink>

          {/* Router Link for Resume */}
          <RouterLink
            to="/resume"
            className="bg-[#A11143] text-neutral-300 rounded-md uppercase text-[18px] font-medium px-4 py-1 outline-none transition-all duration-500 ease-in-out transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A11143]"
          >
            Resume
          </RouterLink>
        </div>
      </div>

      {/* Nav Links */}
      <div className="w-full flex justify-between text-xl max-w-7xl mx-auto px-4 py-2">
        {navLinks.map((item) => (
          <div
            key={item.label}
            className="relative group cursor-pointer hover:text-[#A11143] transition-all duration-500"
          >
            {/* Smooth Scroll Link */}
            <ScrollLink
              to={item.to}
              smooth={true}
              duration={500}
              className="cursor-pointer"
            >
              {item.label}
            </ScrollLink>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#A11143] transition-all duration-300 group-hover:w-full"></span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
