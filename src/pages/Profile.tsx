// src/pages/Profile.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { Button } from "../components/Button";

interface User {
  username: string;
  email?: string;
  createdAt?: string;
  avatar?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false); // for "Show/Hide" toggle for the placeholder

  // Password change inputs (only used when editing)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/v1/user`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setUser(res.data);
        setFormData({
          username: res.data.username || "",
          email: res.data.email || "",
          avatar: res.data.avatar || "",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  // Avatar upload
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("avatar", file);

    try {
      const res = await axios.post(`${API_URL}/api/v1/user/avatar`, fd, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      // expect backend to return something like { fileId: "<gridfs-filename-or-id>" }
      const fileId = res.data?.fileId || res.data?.filename || "";
      // update both local user and formData
      setUser((prev) => (prev ? { ...prev, avatar: fileId } : prev));
      setFormData((prev) => ({ ...prev, avatar: fileId }));
      setMessage("Avatar uploaded (previewing).");
    } catch (err) {
      console.error("Avatar upload error:", err);
      setError("Failed to upload avatar.");
    }
  };

  // Save (single Save for profile + optional password change)
  const handleSave = async () => {
    setError(null);
    setMessage(null);

    try {
      // update username/email/avatar
      await axios.put(
        `${API_URL}/api/v1/user/update`,
        {
          username: formData.username,
          email: formData.email,
          avatar: formData.avatar,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      // change password only if both fields provided
      if (currentPassword && newPassword) {
        await axios.put(
          `${API_URL}/api/v1/user/change-password`,
          { oldPassword: currentPassword, newPassword },
          { headers: { Authorization: localStorage.getItem("token") } }
        );
      }

      // refresh local view (optimistic)
      setUser((prev) => (prev ? { ...prev, ...formData } : prev));
      setEditing(false);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      console.error("Save error:", err);
      // Prefer to show a human-friendly message
      if (err?.response?.data?.msg) setError(err.response.data.msg);
      else setError("Failed to save profile. Please try again.");
    }
  };

  const handleCancel = () => {
    // revert formData to current saved user data
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    });
    setCurrentPassword("");
    setNewPassword("");
    setEditing(false);
    setError(null);
    setMessage(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/v1/user/delete`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      navigate("/signin");
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete account.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-6 text-purple-600">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center text-red-500">{error || "User not found"}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 select-none">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700 cursor-pointer overflow-hidden"
            onClick={handleAvatarClick}
            title="Click to change avatar"
          >
            {user.avatar ? (
              <img
                src={`${API_URL}/api/v1/user/avatar/${user.avatar}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{(user.username?.[0] || "?").toUpperCase()}</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">{user.username || "None"}</h2>
          <p className="text-gray-500">{user.email || "No email provided"}</p>
          {user.createdAt && (
            <p className="text-xs text-gray-400 mt-1">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Messages */}
        {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

        {/* Rows: Username, Email, Password (stacked) */}
        <div className="space-y-4">
          {/* Username */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Username</div>
              {editing ? (
                <input
                  className="border px-3 py-2 rounded-md mt-1 w-64"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              ) : (
                <div className="mt-1 text-gray-800">{user.username || "None"}</div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Email</div>
              {editing ? (
                <input
                  className="border px-3 py-2 rounded-md mt-1 w-64"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <div className="mt-1 text-gray-800">{user.email || "None"}</div>
              )}
            </div>
          </div>

          {/* Password (non-edit view: masked dots, Show/Hide toggler) */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Password</div>

              {!editing ? (
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-gray-800">
                    {/* show dots by default; toggle shows placeholder 'xxxx' */}
                    {showPasswordText ? "xxxx" : "••••••"}
                  </span>
                  <button
                    className="text-sm text-purple-600 hover:underline"
                    onClick={() => setShowPasswordText((s) => !s)}
                  >
                    {showPasswordText ? "Hide" : "Show"}
                  </button>
                </div>
              ) : (
                // editing => show current + new password inputs
                <div className="mt-1 flex flex-col gap-2">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="border px-3 py-2 rounded-md w-64"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="border px-3 py-2 rounded-md w-64"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions: Edit (when not editing) OR Save/Cancel (when editing) + Delete */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex gap-3">
            {editing ? (
              <>
                <Button text="Cancel" variant="secondary" onClick={handleCancel} />
                <Button text="Save" variant="primary" onClick={handleSave} />
              </>
            ) : (
              <Button text="Edit Profile" variant="primary" onClick={() => setEditing(true)} />
            )}
          </div>

          <div>
            <Button
              text="Delete Account"
              variant="secondary"
              onClick={() => {
                // simple confirm
                if (confirm("Delete account? This is irreversible.")) handleDelete();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
