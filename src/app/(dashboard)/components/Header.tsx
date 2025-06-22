"use client";
import { FC } from "react";
import Logo from "../../../components/Logo";
import LogoMobile from "../../../components/LogoMobile";
import SearchBar from "./SearchBar";
import { Notifications } from "./Notifications";
import ProfilePictureComponent from "./ProfilePicture";
import MobileProfileMenu from "./MobileProfilePicture";

const Header: FC = () => {
  return (
    <nav className="max-w-full h-[72px] bg-[#000000] mt-[10px] lg:mt-[15px] lg:max-w-[1410px] md:h-auto lg:h-[171px] md:max-w-[1000px] mx-[10px] lg:mx-[15px] rounded-[15px] xl:max-w-full">
      <div className="max-w-full h-[72px] lg:max-w-[1410px] xl:max-w-full flex items-center justify-between lg:h-full">
        <div className="flex-shrink-0">
          <div className="hidden lg:block">
            <Logo className="my-[11.5px] ml-[15px] fill-white" />
          </div>
          <div className="lg:hidden">
            <LogoMobile className="ml-[12px] my-4 fill-white" />
          </div>
        </div>

        <div className="space-x-[49px] my-[50.5px]">
          <SearchBar
            tasks={[]}
            isLoading={false}
            onSelect={() => {}}
            placeholder="Search..."
          />
        </div>

        <div className="hidden md:flex items-center mr-[15px] my-[40.5px]">
          <Notifications />
          <ProfilePictureComponent />
        </div>

        <div className="lg:hidden w-6 h-auto mr-[30px] my-6">
          <MobileProfileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Header;
