import { HoverEffect } from "../components/ui/card-hover-effect";
import dribbble from "../assets/dribbble.svg";
import linkedin from "../assets/linkedin.svg";
import behance from "../assets/behance.svg";
import insta from "../assets/insta.svg";
import whatsapp from "../assets/whatsapp.svg";

const SocialAcc = () => {
  return (
    <div id="contact" className="max-w-7xl mx-auto text-neutral-200 py-3">
      <h1 className=" text-4xl font-bold text-center">Social Acc.</h1>
      <div className="  ">
        <HoverEffect items={socialLink} />
      </div>
      <hr className="border-[#610A26]" />
      <div className="text-center py-1">
        <p className="text-sm">
          Copyright @2024-24 <span className="font-bold">Designed By:</span>{" "}
          @strologer
        </p>
      </div>
    </div>
  );
};

export const socialLink = [
  {
    title: "Dribbble",
    to: "https://dribbble.com/rajat_k_prajapati",
    src: dribbble,
  },
  {
    title: "LinkedIn",
    to: "https://www.linkedin.com/in/utkarsh-raj032/",
    src: linkedin,
  },
  {
    title: "Instagram",
    to: "https://www.instagram.com/utkarshraz/",
    src: insta,
  },
  {
    title: "Behance",
    to: "https://www.behance.net/rajat-k-prajapati",
    src: behance,
  },
  {
    title: "Whatsapp",
    to: "https://wtsi.me/+919368584530",
    src: whatsapp,
  },
];

export default SocialAcc;
