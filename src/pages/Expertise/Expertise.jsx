import { Techstack } from "./TechStack";
import { ToolStack } from "./ToolStack";

export const Expertise = () => {
  return (
    <div id="stack" className="bg-primary py-6 px-4 sm:px-8 lg:px-16">
      {/* Section Title for Skillset */}
      <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f3f3f3] py-4 sm:py-6">
        Professional <span className="text-[#aaa6c3]">Skillset</span>
      </h1>

      {/* Techstack Component */}
      <div className="max-w-6xl mx-auto">
        <Techstack />
      </div>

      {/* Section Title for Tools */}
      <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f3f3f3] py-4 sm:py-6">
        Tools <span className="text-[#aaa6c3]">I Use</span>
      </h1>

      {/* ToolStack Component */}
      <div className="max-w-6xl mx-auto">
        <ToolStack />
      </div>
    </div>
  );
};