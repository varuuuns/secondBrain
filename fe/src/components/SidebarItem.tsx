import { ReactElement } from "react";

interface SidebarItemProps {
    icon: ReactElement;
    text: string;
}

export function SidebarItem({ icon, text }: SidebarItemProps) {
    return (
        <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition cursor-pointer">
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                {icon}
            </div>
            <span className="text-lg font-medium whitespace-nowrap">{text}</span>
        </div>
    );
}
