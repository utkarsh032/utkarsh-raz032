import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
} from "react-icons/di";
import { SiHtml5, SiCss3, SiExpress } from "react-icons/si";

export const Techstack = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 pb-12">
      {/* HTML Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-red-200 text-red-600 border border-[#610A26] rounded-md">
        <SiHtml5 className="text-4xl md:text-6xl" />
      </div>

      {/* CSS Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-blue-200 text-blue-600 border border-[#610A26] rounded-md">
        <SiCss3 className="text-4xl md:text-6xl" />
      </div>

      {/* JavaScript Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-yellow-200 text-yellow-600 border border-[#610A26] rounded-md">
        <DiJavascript1 className="text-4xl md:text-6xl" />
      </div>

      {/* Node.js Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-green-200 text-green-600 border border-[#610A26] rounded-md">
        <DiNodejs className="text-4xl md:text-6xl" />
      </div>

      {/* Express Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-gray-200 text-gray-800 border border-[#610A26] rounded-md">
        <SiExpress className="text-4xl md:text-6xl" />
      </div>

      {/* React Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-sky-200 text-sky-600 border border-[#610A26] rounded-md">
        <DiReact className="text-4xl md:text-6xl" />
      </div>

      {/* Git Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-orange-200 text-orange-600 border border-[#610A26] rounded-md">
        <DiGit className="text-4xl md:text-6xl" />
      </div>

      {/* Python Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-green-200 text-green-600 border border-[#610A26] rounded-md">
        <DiPython className="text-4xl md:text-6xl" />
      </div>
    </div>
  );
};
