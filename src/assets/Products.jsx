import { useState } from "react";
import { LuExternalLink } from "react-icons/lu";
import Behance from "../assets/behance.png";
import Dribbble from "../assets/dribbble.svg";

import Project1 from "../assets/omnifood.gif";
import Project2 from "../assets/destination.gif";
import Project3 from "../assets/TheBerth.gif";
import Project4 from "../assets/Cryptoptika.gif";
import Project5 from "../assets/Podsphere.gif";
import Project6 from "../assets/Deciphr.gif";
import { motion } from "framer-motion";

const Products = () => {
  return (
    <section id="project" className="max-w-7xl mx-auto py-8 px-2 text-white">
      <h1 className="text-4xl font-bold py-6 text-center">My Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {ProjectLink.map((project, index) => (
          <ProjectItem key={index} project={project} />
        ))}
      </div>
      <button className="flex mx-auto mt-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300">
        Show More
      </button>
    </section>
  );
};

const ProjectItem = ({ project }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="p-2 rounded-2xl relative border shadow-xl border-[#610A26] bg-[#150014]/50 backdrop-blur-xl transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <img src={project.src} className="rounded-xl" alt="project" />
      <div className="py-4 px-2">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="font-thin line-clamp-3">{project.desc}</p>
        <div className="flex justify-between py-1 my-2 text-center">
          <div className="flex gap-1">
            <p className="text-[#FF0000]">{project.tag1}</p>
            <p className="text-[#24FF00]">{project.tag2}</p>
            <p className="text-[#FFF500]">{project.tag3}</p>
          </div>
          <a
            href={project.to}
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-full text-lg px-2 block duration-300 hover:bg-white hover:text-black flex items-center gap-1"
          >
            {hovered ? (
              <span className="flex items-center gap-1">
                View <LuExternalLink />
              </span>
            ) : (
              "View"
            )}
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectLink = [
  {
    name: "Omnifood",
    desc: "cyour premier destination for convenient and delicious food ordering. Designed for the modern food  Omnifood seamlessly connects you delights, right at your fingertips",
    tag1: "#html",
    tag2: "#css",
    tag3: "#js",
    to: "https://omnifood-utkarshraj.netlify.app/",
    src: Project1,
    img: Behance,
  },
  {
    name: "destination",
    desc: "Destination is a modern travel app designed to simplify hotel bookings and trip planning for travelers. Built with React and SCSS, it offers a responsive and user-friendly interface. Explore and organize your journeys effortlessly with seamless integration of REST APIs.",
    tag1: "#react",
    tag2: "#scss",
    tag3: "#resapi",
    to: "https://destination-travelling-app.netlify.app/",
    src: Project2,
    img: Behance,
  },
  {
    name: "Udemy-Clone",
    desc: "It is an online learning platform that mimics the core features of Udemy. It includes a video player for course content, detailed course data, and user authentication with email validation. Additional features like Udemy Business and course posting enhance the platform, offering a comprehensive learning and teaching experience.",
    tag1: "#react",
    tag2: "#tailwind",
    tag3: "#mongoDB",
    to: "https://github.com/utkarsh032/Udemy/tree/main/client",
    src: Project3,
    img: Dribbble,
  },
  {
    name: "bharate-state",
    desc: "Bharat-Estate is a modern real estate platform for buying, selling, and renting properties in India. It features secure user authentication, real-time updates, and a responsive design for a seamless experience. Powered by a robust backend, it ensures efficiency and scalability for property management.",
    tag1: "#react",
    tag2: "#node",
    tag3: "#mongodb",
    to: "https://github.com/utkarsh032/Bharat-Estate",
    src: Project4,
    img: Behance,
  },
  {
    name: "book",
    desc: "The Book Store App is a comprehensive platform designed to enhance the book-buying and selling experience. This application offers features such as browsing best-seller books, managing seller accounts, accessing promotional offers, and engaging with blog content.",
    tag1: "#react",
    tag2: "#tailwind",
    tag3: "#mongoDB",
    to: "https://github.com/utkarsh032/book-store-app",
    src: Project5,
    img: Behance,
  },
  {
    name: "Deciphr - Redesign & Case Study",
    desc: "Redesigned deciphr’s Web App.",
    tag1: "#UIDesign",
    tag2: "#website",
    tag3: "#userreasearch",
    to: "https://www.behance.net/gallery/190273715/Deciphr-Redesign-Case-Study",
    src: Project6,
    img: Behance,
  }
];
export default Products;
