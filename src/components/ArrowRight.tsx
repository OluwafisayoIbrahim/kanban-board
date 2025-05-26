import * as React from "react";

type IconProps = React.SVGProps<SVGElement> & {
    className?: string;
}
const SvgIcon: React.FC<IconProps> = ({className}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className={className}
  >
    <path fill="#fff" d="M0 0h24v24H0z"></path>
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 12h14"
    ></path>
    <path fill="#fff" d="m12 5 7 7-7 7"></path>
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m12 5 7 7-7 7"
    ></path>
  </svg>
);

export default SvgIcon;
