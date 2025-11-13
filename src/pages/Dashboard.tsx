import { Button } from "../components/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/Card";
import { useEffect, useState, useRef } from "react";
import { CreateContent } from "../components/CreateContent";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [open, setOpen] = useState(false);
  const { contents, fetchContents } = useContent();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(""); // sidebar filter

  useEffect(() => {
    fetchContents();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function share() {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/brain/share`,
        { share: true },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );
      const link = `http://localhost:5173/brain/${res.data.link}`;
      await navigator.clipboard.writeText(link);
      alert("Link Copied to Clipboard!");
    } catch (err) {
      console.log("Error", err);
      alert("please try again, error happened");
    }
  }

  async function unshare() {
    try {
      await axios.post(
        `${API_URL}/api/v1/brain/share`,
        { share: false },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );
      alert("Unshared successfully!");
    } catch (err) {
      console.log("Error", err);
      alert("please try again, error happened");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/signin");
  }

  const userName = localStorage.getItem("userName") || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();

  // 🔎 filter by search + sidebar type
  const filteredContents = contents.filter(({ title, link, type }) => {
    const q = search.trim().toLowerCase();
    const matchesType = selectedType ? type === selectedType : true;
    const matchesSearch =
      !q || title.toLowerCase().includes(q) || link.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar with filter */}
      <Sidebar selectedType={selectedType} onSelect={setSelectedType} />

      <div className="p-4 ml-72 min-h-screen bg-gray-100 relative flex-1">
        {/* CreateContent Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
            <CreateContent
              open={open}
              onClose={() => setOpen(false)}
              onContentAdded={fetchContents}
            />
          </div>
        )}

        {/* Top Bar */}
        <div className="flex justify-end items-center space-x-4 mb-4 w-full">
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
          <Button variant="secondary" text="Dlt share" onClick={unshare} />

          {/* Profile dropdown */}
          <div className="relative select-none" ref={dropdownRef}>
            <div
              className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Profile menu"
            >
              {avatarLetter}
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="py-2 text-gray-700">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/settings");
                    }}
                  >
                    Settings
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
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

        {/* Search */}
        <div className="mb-6">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your saved links..."
                className="w-full max-w-xl outline-purple-500 px-4 py-2 border border-gray-300 rounded-md caret-transparent"
            />
        </div>


        {/* Content Cards */}
        <div className="flex gap-4 flex-wrap">
          {filteredContents.map(({ _id, title, link, type }) => (
            <Card key={_id} contentId={_id} title={title} link={link} type={type} />
          ))}

          {filteredContents.length === 0 && (
            <p className="text-gray-600">No content found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
