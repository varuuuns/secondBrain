import { Button } from "../components/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/Card";
import { useEffect, useState, useRef } from "react";
import { CreateContent } from "../components/CreateContent";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
    const [open, setOpen] = useState(false);
    const { contents, reload } = useContent();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        reload();
    }, [open]);

    // close profile dropdown when clicked outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // -------------------- share brain --------------------
    async function share() {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/brain/share`,
                { share: true },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
                    },
                }
            );
            console.log("token", localStorage.getItem("Authorization"));
            console.log(response.data);
        } catch (err) {
            console.log("Error", err);
            alert("please try again, error happend");
        }
    }

    // -------------------- delete/unshare brain --------------------
    async function varun() {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/brain/share`,
                { share: false },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
                    },
                }
            );
            console.log(response);
        } catch (err) {
            console.log("Error", err);
            alert("please try again, error happend");
        }
    }

    // -------------------- logout --------------------
    function logout() {
        localStorage.removeItem("Authorization");
        navigate("/signin");
    }

    // -------------------- user info --------------------
    const userName = localStorage.getItem("userName") || "User";
    const avatarLetter = userName.charAt(0).toUpperCase();

    return (
        <div className="bg-gray-100">
            <div>
                <Sidebar />
            </div>

            <div className="p-4 ml-72 min-h-screen bg-gray-100 relative">
                {/* Create Content Modal */}
                {open && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                        <CreateContent
                            open={open}
                            onClose={() => setOpen(false)}
                            onContentAdded={reload}
                        />
                    </div>
                )}

                {/* Header with buttons + profile */}
                <div className="flex justify-end items-center space-x-4 mb-6 w-full">
                    <Button
                        variant="secondary"
                        text="Share Brain"
                        startIcon={<ShareIcon />}
                        onClick={share}
                    />
                    <Button
                        onClick={() => setOpen(true)}
                        variant="primary"
                        text="Add Content"
                        startIcon={<PlusIcon />}
                    />
                    <Button
                        variant="secondary"
                        text="Dlt share"
                        onClick={varun}
                    />

                    {/* Profile Dropdown */}
                    <div className="relative select-none" ref={dropdownRef}>
                        <div
                            className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold cursor-pointer select-none"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            {avatarLetter}
                        </div>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 select-none">
                                <ul className="py-2 text-gray-700">
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer select-none"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("/profile");
                                        }}
                                    >
                                        Profile
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer select-none"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("/settings");
                                        }}
                                    >
                                        Settings
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer select-none"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            logout();
                                        }}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex gap-4 flex-wrap">
                    {contents.map(({ _id, title, link, type }) => (
                        <Card
                            key={_id}
                            contentId={_id}
                            title={title}
                            link={link}
                            type={type}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
