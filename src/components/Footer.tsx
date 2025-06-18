import React from "react";
import FooterLogo from "./FooterLogo";
import { Discord, Instagram, LinkedIn, TikTok } from "./SocialMediaIcons";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#333333] py-[10px] px-[11px] lg:py-[22px] lg:px-[23px] w-full min-h-[361px]">
      <div className="max-w-[1410px] mx-auto h-auto grid grid-cols-1 text-left lg:grid-cols-3">
        <div className="col-span-1 flex flex-col items-start">
          <FooterLogo className="w-[108px] h-[34px] lg:w-[224px] lg:h-[67px] -ml-2 lg:-ml-3.5" />
          <p className="text-[12px] lg:text-[20px] font-normal text-[#FFFFFF] mt-[6px] lg:mt-8">
            FlowSpace is your all-in-one Kanban solution, helping teams stay
            organized and efficient.
          </p>
          <div className="flex space-x-[10px] lg:space-x-[21px] mt-[11px] lg:mt-[21px]">
            <Link href="/">
              <Instagram className="w-5 h-5 lg:w-12 lg:h-12" />
            </Link>
            <Link href="/">
              <LinkedIn className="w-5 h-5 lg:w-12 lg:h-12" />
            </Link>
            <Link href="/">
              <TikTok className="w-5 h-5 lg:w-12 lg:h-12" />
            </Link>
            <Link href="/">
              <Discord className="w-5 h-5 lg:w-12 lg:h-12" />
            </Link>
          </div>
          <p className="hidden lg:block text-[12px] lg:text-[16px] text-[#FFFFFF] mt-[21px]">
            &copy; {year}. FlowSpace. All rights reserved.
          </p>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <div className="grid grid-cols-2 gap-x-6 mt-4 lg:mt-0">
            <div className="col-span-1 lg:mt-3 text-center">
              <h3 className="font-bold text-[11px] lg:text-[24px] mb-[20px] text-[#FFFFFF] ">
                Product
              </h3>
              <ul className="space-y-5 lg:space-y-[30px] text-[#FFFFFF] font-normal text-[10px] lg:text-[16px]">
                <li>
                  <Link
                    href="/features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tutorials"
                    className="hover:text-white transition-colors"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api-docs"
                    className="hover:text-white transition-colors"
                  >
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-1 lg:mt-3 text-center">
              <h3 className="font-bold text-[11px] lg:text-[24px] mb-[20px] text-[#FFFFFF]">
                Support
              </h3>
              <ul className="space-y-5 lg:space-y-[30px] text-[#FFFFFF] font-normal text-[10px] lg:text-[16px]">
                <li>
                  <Link
                    href="/help-center"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community-forum"
                    className="hover:text-white transition-colors"
                  >
                    Community Forum
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/status-page"
                    className="hover:text-white transition-colors"
                  >
                    Status Page
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="lg:hidden text-[12px] lg:text-[16px] font-normal text-center mt-[29px] text-[#FFFFFF]">
          &copy; {year}. FlowSpace. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
