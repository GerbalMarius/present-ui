"use client";

import MenuButton from "./MenuButton";

type SidebarLink = {
  id: string;
  label: string;
  iconSrc: string;
  active: boolean;
  onClick: () => void;
};

interface DashboardSidebarProps {
  title: string;
  subtitle: string;
  avatarText: string;
  links: SidebarLink[];
  onExit: () => void;
  exitLabel?: string;
}

export default function DashboardSidebar({
  title,
  subtitle,
  avatarText,
  links,
  onExit,
  exitLabel = "Exit",
}: DashboardSidebarProps) {
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 bg-linear-to-b from-red-200 via-red-300 to-red-400 text-slate-900 flex-col py-6 px-4 shadow-xl">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-white/90 flex items-center justify-center shadow-md">
          <span className="font-bold text-xl text-red-700">{avatarText}</span>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase text-red-800">
            {title}
          </p>
          <p className="text-xs text-red-900/80">{subtitle}</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <MenuButton
            key={link.id}
            active={link.active}
            label={link.label}
            iconSrc={link.iconSrc}
            onClick={link.onClick}
          />
        ))}
      </nav>

      <button
        onClick={onExit}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold px-4 py-2 shadow-md transition bg-red-800 text-white hover:bg-red-700"
      >
        {exitLabel}
      </button>
    </aside>
  );
}