import { SiPostman, SiMongodb } from "react-icons/si";
import { BiLogoVisualStudio, BiLogoNetlify, BiLogoFirebase } from "react-icons/bi";

export const ToolStack = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 pb-12">
      {/* Visual Studio Code Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-blue-200 text-blue-600 border border-[#610A26] rounded-md">
        <BiLogoVisualStudio className="text-5xl md:text-7xl" />
      </div>

      {/* Postman Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-orange-200 text-orange-600 border border-[#610A26] rounded-md">
        <SiPostman className="text-5xl md:text-7xl" />
      </div>

      {/* MongoDB Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-green-200 text-green-600 border border-[#610A26] rounded-md">
        <SiMongodb className="text-5xl md:text-7xl" />
      </div>

      {/* Netlify Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-cyan-200 text-cyan-600 border border-[#610A26] rounded-md">
        <BiLogoNetlify className="text-5xl md:text-7xl" />
      </div>

      {/* Firebase Icon */}
      <div className="tech-icon bg-primary p-4 md:p-6 hover:bg-yellow-200 text-yellow-600 border border-[#610A26] rounded-md">
        <BiLogoFirebase className="text-5xl md:text-7xl" />
      </div>
    </div>
  );
};
