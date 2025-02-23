import { AudioIcon } from "../icons/AudioIcon";
import { ImageIcon } from "../icons/ImageIcon";
import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwittterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";

export function Sidebar() {
    return (
        <div className="h-screen bg-white border-r border-gray-100 w-64 fixed left-0 top-0 p-4 shadow-lg flex flex-col">

            <div className="flex items-center space-x-3 text-2xl font-semibold text-gray-800">
                <Logo />
                <span>Second Brain</span>
            </div>

            <div className="mt-2 space-2">
                <SidebarItem icon={<TwitterIcon />} text="Tweets" />
                <SidebarItem icon={<YoutubeIcon />} text="Videos" />
                <SidebarItem icon={<ImageIcon />} text="Images" />
                <SidebarItem icon={<AudioIcon />} text="Audios" />
            </div>
        </div>
    );
}