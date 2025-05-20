import { FC } from "react";
import Logo from "./Logo";
import LogoMobile from "./LogoMobile";
import Link from "next/link";

const Header: FC = () => {
  return (
    <nav className="max-w-[375px] h-[72px] bg-[#000000] mt-3 lg:max-w-[1410px] lg:h-[171px] mx-2 rounded-[15px]">
      <div className="relative hidden lg:block">
        <Logo className="mt-3 ml-5 absolute" />
      </div>
      <div className="relative lg:hidden">
        <LogoMobile className="mt-4 ml-5 absolute" />
      </div>
      <div className="hidden lg:block">
        <div className="flex justify-center items-center h-[70px] w-[480px] ml-80 my-14 absolute">
          <div className="mx-[27px] my-[13px] space-x-[49px]">
            <Link href="/" className="text-white text-xl font-medium ">
              Features
            </Link>
            <Link href="/" className="text-white text-xl font-medium">
              How it works
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
