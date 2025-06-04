"use client";
import { FC, useState } from "react";
import Logo from "./Logo";
import LogoMobile from "./LogoMobile";
import Link from "next/link";
import {
  AlignJustify,
  Info,
  LogIn,
  Phone,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="max-w-full h-[72px] bg-[#000000] mt-[10px] lg:mt-[15px] lg:max-w-[1410px] md:h-auto lg:h-[171px] md:max-w-[1000px] mx-[10px] lg:mx-[15px] rounded-[15px] xl:max-w-full">
      {/* inner flex container */}
      <div className="max-w-full h-[72px] lg:max-w-[1410px] xl:max-w-full flex items-center justify-between lg:h-full">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="hidden lg:block">
            <Logo className="my-[11.5px] ml-[15px]" />
          </div>
          <div className="lg:hidden">
            <LogoMobile className="ml-[12px] my-4" />
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex space-x-[49px] my-[50.5px]">
          <Link
            href="/"
            className="text-white text-lg font-normal hover:text-gray-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/"
            className="text-white text-lg font-normal hover:text-gray-400 transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/"
            className="text-white text-lg font-normal hover:text-gray-400 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Sign In / Sign Up buttons */}
        <div className="hidden md:flex items-center space-x-[39px] mr-[15px] my-[40.5px]">
          <Link href="/signin">
            <Button
              variant="outline"
              className="cursor-pointer text-white border border-[#FFFFFF] bg-[#000000] hover:bg-gray-800 hover:text-white w-30 h-[50px] rounded-[6px] text-[16px] font-normal"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="cursor-pointer bg-white text-black hover:bg-gray-200 w-30 h-[50px] rounded-[6px] text-[16px] font-normal">
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="lg:hidden w-6 h-auto mr-[26px] my-6">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="text-white active:outline-none transition-transform duration-200 hover:scale-110 p-0 w-6 h-6"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <AlignJustify className="w-6 h-6" />
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="bottom"
              className="bg-black border border-gray-800 p-4 w-64 rounded-xl shadow-lg animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-5 data-[state=open]:animate-in"
              sideOffset={8}
            >
              <DropdownMenuGroup className="space-y-3">
                <DropdownMenuItem
                  asChild
                  className="px-3 py-2.5 rounded-lg hover:bg-gray-800 focus:bg-gray-800"
                >
                  <Link href="/" className="flex items-center text-white">
                    <Zap className="mr-3 h-5 w-5 text-white" />
                    <span className="text-sm font-normal">Features</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="px-3 py-2.5 rounded-lg hover:bg-gray-800 focus:bg-gray-800"
                >
                  <Link href="/" className="flex items-center text-white">
                    <Info className="mr-3 h-5 w-5 text-white" />
                    <span className="text-sm font-normal">How it works</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="px-3 py-2.5 rounded-lg hover:bg-gray-800 focus:bg-gray-800"
                >
                  <Link href="/" className="flex items-center text-white">
                    <Phone className="mr-3 h-5 w-5 text-white" />
                    <span className="text-sm font-normal">Contact Us</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-4 bg-gray-700" />

              <div className="flex flex-col space-y-2">
                <Link href="/signin">
                  <Button
                    variant="outline"
                    className="w-full border-[#FFFFFF] text-white hover:bg-gray-800 hover:text-white transition-colors bg-[#000000] rounded-[6px] text-[16px] font-normal"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-white text-black hover:bg-gray-200 transition-colors rounded-[6px] text-[16px] font-normal">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Header;
