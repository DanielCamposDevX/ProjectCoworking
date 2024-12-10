import Cloud from "@/assets/data-extraction2.svg";
import Cloud2 from "@/assets/data-extraction3.svg";

import Logo from "@/assets/logo_branca.png";

import Image from "next/image";
import Link from "next/link";
import { TemplateButton } from "./templates/Button";

export default function SideImage({
  title,
  subtitle,
  buttonText,
  link,
  side,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  side: "left" | "right";
}) {
  return (
    <div className="w-full h-52 lg:w-1/2 flex-1 lg:h-full bg-transparent relative flex-col justify-center items-center flex bg-white">
      <Image
        src={Logo}
        alt="Logo"
        className={`z-50 w-[200px] absolute top-4 ${
          side === "right" ? "left-4" : "right-4"
        } lg:flex hidden`}
      />
      <div className="z-50 flex flex-col gap-4 justify-center items-center ">
        <Image
          src={side === "right" ? Cloud : Cloud2}
          alt="Cloud"
          className="z-50 w-[250px] max-h-[30vh] lg:w-[300px] mt-10"
        />
        <h1 className="text-white z-50 text-xl font-bold hidden lg:flex  w-[350px]">
          {title}
        </h1>
        <h2 className="text-white z-50 text-sm hidden lg:flex  w-[350px]">
          {subtitle}
        </h2>
        <Link href={link}>
          <TemplateButton.Secondary loading={false} text={buttonText} />
        </Link>
      </div>
      <div
        className={`absolute ${
          side === "right"
            ? "rounded-ee-[80px]"
            : "rounded-ee-[80px] lg:rounded-ee-[0px]  lg:rounded-ss-[80px]"
        } overflow-hidden w-full h-full gradient`}
      />
    </div>
  );
}
