import { useRef, useState, useEffect } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface CreateContentProps {
    open: boolean;
    onClose: () => void;
    onContentAdded: (newContent: any) => void;
}

export function CreateContent({
    open,
    onClose,
    onContentAdded,
}: CreateContentProps) {
    if (!open) return null;

    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const tagRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            if (tagRef.current) tagRef.current.value = "";
            setError(null);
        }
    }, [open]);

    async function addContent() {
        setError(null);
        setLoading(true);

        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
        const tags = tagRef.current?.value
            ?.split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "");

        if (!title || !link) {
            setError("Title and Link are required.");
            setLoading(false);
            return;
        }

        let type:
            | "image"
            | "video"
            | "audio"
            | "tweet"
            | "blogs"
            | "articles"
            | "other" = "other";

        const linkLower = link.toLowerCase();
        const imageExtensions = ["jpeg", "jpg", "gif", "tiff", "svg", "png"];
        const videoExtensions = ["mp4", "mov", "avi", "mkv"];
        const audioExtensions = ["mp3", "wav", "ogg"];

        if (imageExtensions.some((ext) => linkLower.endsWith("." + ext))) {
            type = "image";
        } else if (videoExtensions.some((ext) => linkLower.endsWith("." + ext))) {
            type = "video";
        } else if (audioExtensions.some((ext) => linkLower.endsWith("." + ext))) {
            type = "audio";
        } else if (linkLower.includes("twitter.com") || linkLower.includes("x.com")) {
            type = "tweet";
        } else if (linkLower.includes("youtube.com") || linkLower.includes("vimeo.com")) {
            type = "video";
        } else if (
            linkLower.includes("medium.com") ||
            linkLower.includes("substack.com") ||
            linkLower.includes("dev.to")
        ) {
            type = "blogs";
        }

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/content`,
                {
                    title: title,
                    link: link,
                    tags: tags,
                    type: type,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            onContentAdded(response.data);
            onClose();
        } catch (err) {
            console.error("Error adding content:", err);
            setError("Failed to add content. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background overlay with blur */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className="bg-white p-6 rounded-2xl shadow-2xl relative z-10 w-full max-w-lg transition-all transform scale-100 opacity-100">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Add New Link</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <CrossIcon />
                    </button>
                </div>

                {/* Error message */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Input fields */}
                <div className="space-y-4">
                    <Input reference={titleRef} type="text" placeholder="Title of the link" />
                    <Input reference={linkRef} type="text" placeholder="URL of the link" />
                    <Input reference={tagRef} type="text" placeholder="Tags (comma separated)" />
                </div>

                {/* Save button */}
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={addContent}
                        variant="primary"
                        text={loading ? "Saving..." : "Save Link"}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}
