import * as React from "react";

type LogoProps = {
  className?: string;
};

const SvgIcon: React.FC<LogoProps> = ({className}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    fill="none"
    viewBox="0 0 40 40"
    className={className}
  >
    <path
      fill="#fff"
      d="M0 10.276h11.02c1.225 0 2.205 1.02 2.205 2.293s-.98 2.293-2.205 2.293H0c.408 5.775 5.061 10.276 10.694 10.276h.408c1.224 0 2.204 1.02 2.204 2.293s-.98 2.293-2.204 2.293h-.408C5.06 29.724.408 34.225 0 40h29.306C34.94 40 39.592 35.499 40 29.724H28.98c-1.225 0-2.204-1.02-2.204-2.293s.98-2.293 2.204-2.293H40c-.408-5.775-5.061-10.276-10.694-10.276h-.408c-1.224 0-2.204-1.02-2.204-2.293s.98-2.293 2.204-2.293h.408C34.94 10.276 39.592 5.775 40 0H10.694C5.06 0 .408 4.501 0 10.276"
    ></path>
  </svg>
);

export default SvgIcon;
