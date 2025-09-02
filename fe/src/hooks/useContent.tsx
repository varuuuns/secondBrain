import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";

interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
  description?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export function useContent() {
  const [contents, setContents] = useState<Content[]>([]);

  // Function to reload content from the backend
  async function reload() {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      });
      // Assuming your API returns an array of content objects
      setContents(response.data.Content);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }

  // Function to toggle the favorite status of a content item
  async function toggleFavorite(contentId: string) {
    try {
      // Optimistically update the UI for a faster user experience
      setContents((prevContents) =>
        prevContents.map((content) =>
          content._id === contentId
            ? { ...content, isFavorite: !content.isFavorite }
            : content
        )
      );

      // Send the request to the backend to persist the change
      await axios.post(
        `${BACKEND_URL}/api/v1/content/${contentId}/favorite`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      );
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      // Revert the state if the API call fails
      reload();
    }
  }

  // Function to filter content by a specific tag
  function filterByTag(tag: string) {
    // This function will be called by your Dashboard component
    // It filters the current contents based on the presence of a tag
    return contents.filter((content) => content.tags?.includes(tag));
  }

  return { contents, reload, toggleFavorite, filterByTag };
}