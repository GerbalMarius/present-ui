"use client";

import Image from "next/image";

interface MenuButtonProps {
  active: boolean;
  label: string;
  iconSrc: string;
  onClick: () => void;
}

const MenuButton = ({
  active,
  label,
  iconSrc,
  onClick,
}: MenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition",
        "focus:outline-none focus:ring-2 focus:ring-red-300",
        active
          ? "bg-red-100 text-red-900 shadow-sm border border-red-200"
          : "text-red-900/80 hover:bg-red-50 hover:text-red-950",
      ].join(" ")}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center">
        <Image src={iconSrc} alt={label} width={18} height={18} />
      </span>

      <span className="tracking-tight">{label}</span>
    </button>
  );
}

export default MenuButton;
