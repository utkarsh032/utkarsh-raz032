import { BsBriefcaseFill } from "react-icons/bs";
import { PiCertificateFill } from "react-icons/pi";
import { LuExternalLink } from "react-icons/lu";

const Experience = () => {
  return (
    <section id="education" className="max-w-7xl mx-auto py-8 flex flex-col sm:flex-row">
      <div className="px-4 sm:w-1/2">
        <h1 className="text-neutral-100 text-4xl font-bold py-2 px-4 rounded-r-3xl rounded-tl-3xl bg-[#A11143] inline-block">
          Education
        </h1>
        {Education.map((item, index) => (
          <div
            key={index}
            className="text-neutral-200 border border-[#610A26] my-4 p-4 rounded-2xl backdrop-blur-xl bg-[#150014]/50 transition-transform duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <BsBriefcaseFill className="text-2xl" />
              <h4>{item.duration}</h4>
            </div>
            <div className="md:px-10 px-1 py-2">
              <div className="flex gap-4 items-center">
                <h3 className="md:text-2xl text-xl font-bold">{item.role}</h3>
                <p className="text-neutral-300 font-thin">{item.branch}</p>
              </div>
              <ul className="list-disc pl-5">
                <li className="py-1">
                  <span className="w-3 h-3 bg-[#A11143] animate-pulse rounded-full inline-block mr-2" />
                  {item.highlight1}
                </li>
                <li className="py-1">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block mr-2" />
                  {item.highlight2}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 sm:w-1/2 md:flex md:flex-col">
        <div className="flex justify-end py-2">
          <h1 className="text-neutral-100 text-4xl font-bold py-2 px-4 rounded-tr-3xl rounded-l-3xl bg-[#A11143]">
            Achievemnet
          </h1>
        </div>
        {Achievement.map((item, index) => (
          <div
            key={index}
            className="text-neutral-200 border border-[#610A26] my-4 py-4 px-1 rounded-xl backdrop-blur-xl bg-[#150014]/50 transition-transform duration-300 hover:scale-105"
          >
            <div className="flex items-center px-2 gap-2">
              <PiCertificateFill className="text-2xl" />
              <h4>{item.duration}</h4>
            </div>
            <div className="md:px-8 px-2 py-2">
              <div className="flex items-center">
                <h3 className="md:text-2xl text-xl font-bold">{item.title}</h3>
              </div>
              <div className="flex text-center items-center justify-between">
                <p className="text-neutral-300 font-thin">{item.organization}</p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-full px-2 py-1 inline-flex items-center gap-2 my-4 transition-colors duration-300 hover:bg-[#A11143] hover:text-white"
                >
                  View Certificate
                  <LuExternalLink />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Education = [
  {
    duration: "Apr 2021 - Jul 2023",
    role: "Bachelor of Computer Applications",
    branch: "Monad University, Meerut",
    highlight1: "Developed a user-centric 'Integrated Fulfillment (IF)' dashboard, integrating Warehouse & Transport Management functions.",
    highlight2: "Enhanced user experience for websites and mobile apps, ensuring seamless and efficient interaction.",
  },
  {
    duration: "Apr 2023 - May 2023",
    role: "Zero To Mastery Academy",
    branch: "Online",
    highlight1: "Worked on 30+ projects, including books, magazines, and packaging, learning end-to-end design processes.",
    highlight2: "Leveraged project experience to contribute to production efficiency and company growth.",
  },
  {
    duration: "May 2024 - Present",
    role: "Full-Stack Web Development Program",
    branch: "Masai School, Bangalore",
    highlight1: "Crafted engaging content and applications that enhanced brand visibility and usability.",
    highlight2: "Acquired expertise in digital marketing, agile methodologies, and full-stack software development.",
  },
];


const Achievement = [
  {
    duration: "July 2024",
    title: "SQL Certification",
    organization: "HackerRank",
    href: "https://drive.google.com/file/d/1iZ92CT04cZfffKFZdUT_xB3HbeUFz2n2/view?usp=sharing",
  },
  {
    duration: "April 2023",
    title: "Complete React Developer",
    organization: "Zero To Mastery Academy",
    href: "https://drive.google.com/file/d/1NXs-Cui-IeWQny6sb0vz7Lya8WehsbsO/view?usp=sharing",
  },
  {
    duration: "July 2024",
    title: "Career Essentials in Generative AI",
    organization: "Microsoft and LinkedIn Learning",
    href: "https://drive.google.com/file/d/1ig0zRkknylaekrcZMXn-K8oMjtFqUA21/view?usp=sharing",
  },
];


export default Experience;
