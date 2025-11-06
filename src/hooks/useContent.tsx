// src/hooks/useContent.tsx
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function useContent() {
  const [contents, setContents] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to get token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: token } : {};
  };

  // Fetch all contents
  const fetchContents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: getAuthHeader(),
      });
      setContents(res.data.Content);
    } catch (err: any) {
      console.error("Fetch contents error:", err);
      setError("Failed to load contents");
    } finally {
      setLoading(false);
    }
  };

  // Add content
  const addContent = async (newContent: { title: string; url: string }) => {
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/v1/content`, newContent, {
        headers: getAuthHeader(),
      });
      await fetchContents();
    } catch (err: any) {
      console.error("Add content error:", err);
      setError("Failed to add content");
    } finally {
      setLoading(false);
    }
  };

  // Delete content
  const deleteContent = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${BACKEND_URL}/api/v1/content/${id}`, {
        headers: getAuthHeader(),
      });
      await fetchContents();
    } catch (err: any) {
      console.error("Delete content error:", err);
      setError("Failed to delete content");
    } finally {
      setLoading(false);
    }
  };

  // Share brain (example)
  const shareBrain = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/content/share`,
        {},
        { headers: getAuthHeader() }
      );
      return res.data;
    } catch (err: any) {
      console.error("Share brain error:", err);
      setError("Failed to share brain");
    } finally {
      setLoading(false);
    }
  };

  // Delete share (example)
  const deleteShare = async () => {
    try {
      setLoading(true);
      await axios.delete(`${BACKEND_URL}/api/v1/content/share`, {
        headers: getAuthHeader(),
      });
    } catch (err: any) {
      console.error("Delete share error:", err);
      setError("Failed to delete share");
    } finally {
      setLoading(false);
    }
  };

  return {
    contents,
    loading,
    error,
    fetchContents,
    addContent,
    deleteContent,
    shareBrain,
    deleteShare,
  };
}
