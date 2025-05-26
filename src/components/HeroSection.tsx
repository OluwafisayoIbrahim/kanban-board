import React from "react";
import { Button } from "./ui/button";
import ArrowRight from "./ArrowRight";

const HeroSection = () => {
  return (
    <div className="mx-[20px] mt-[49px] lg:mx-[255px] lg:mt-[114px]">
      <div className="mt-[34px] mx-1 xl:mt-[92px] xl:mx-[7px]">
        <h1 className="text-[32px] font-normal lg:text-[64px] text-center text-white ">
          Organize. Prioritize. Flow. Welcome to{" "}
          <span className="font-bold">FlowSpace Kanban Board.</span>
        </h1>
      </div>
      <p className="text-[16px] mt-4 text-[#F0F0F0] lg:text-2xl font-normal text-center mx-[4px] lg:mx-[135px]">
        Simple, visual task management that helps your team stay focused and get
        more done.
      </p>
      <div className="flex justify-center items-center mt-[30px] mb-[30px]">
        <Button
          variant="outline"
          className="cursor-pointer text-lg text-[#000000] lg:text-2xl text-center rounded-[8px] lg:w-auto lg:h-[64px] h-[56px] font-normal gap-[17px] lg:gap-6"
        >
         Get Started
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
