import { ReactElement } from "react";

interface SidebarItemProps {
  icon: ReactElement;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon, text, active = false, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-lg transition cursor-pointer select-none
        ${active ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}
      `}
    >
      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-lg whitespace-nowrap">{text}</span>
    </div>
  );
}
