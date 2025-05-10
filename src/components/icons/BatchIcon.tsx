import React from "react";

interface BatchIconProps {
  className?: string;
}

export const BatchIcon = ({ className }: BatchIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M4.5 3h15"></path>
      <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"></path>
      <path d="M6 14h12"></path>
    </svg>
  );
};
