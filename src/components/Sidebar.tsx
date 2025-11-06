import { AudioIcon } from "../icons/AudioIcon";
import { ImageIcon } from "../icons/ImageIcon";
import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwittterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export function Sidebar({ selectedType, onSelect }: SidebarProps) {
  const items = [
    { type: "tweet", label: "Tweets", icon: <TwitterIcon /> },
    { type: "video", label: "Videos", icon: <YoutubeIcon /> },
    { type: "image", label: "Images", icon: <ImageIcon /> },
    { type: "audio", label: "Audios", icon: <AudioIcon /> },
  ];

  return (
    <div className="h-screen bg-white border-r border-gray-100 w-64 fixed left-0 top-0 p-4 shadow-lg flex flex-col select-none">
      <div className="flex items-center space-x-3 text-2xl font-semibold text-gray-800 mb-4 cursor-pointer select-none"
        onClick={() => onSelect("")}>
        <Logo />
        <span>Second Brain</span>
      </div>

      <div className="flex flex-col space-y-2">
        {items.map((item) => (
          <SidebarItem
            key={item.type}
            icon={item.icon}
            text={item.label}
            active={selectedType === item.type}
            onClick={() => onSelect(item.type)}
          />
        ))}
      </div>
    </div>
  );
}
