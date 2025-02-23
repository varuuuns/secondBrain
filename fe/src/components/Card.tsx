import { useEffect, useRef } from "react";
import { ShareIcon } from "../icons/ShareIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { DeleteIcon } from "../icons/DeleteIcon";

const defaultStyles = "p-4 bg-white shadow-lg rounded-xl border border-gray-200 max-w-80 flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl duration-200 z-10";

interface CardProps {
    contentId: string;
    title: string;
    type: "tweet" | "video" | "image" | "audio" | "articles" | "blogs";
    link: string;
}

declare global {
    interface Window {
        twttr?: any;
    }
}

function EmbeddVideo({ link }: { link: string }) {
    const videoIdMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) return <p className="text-red-500">Invalid video link</p>;

    return (
        <div className="relative w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
            <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            />
        </div>
    );
}

function EmbeddTweet({ link }: { link: string }) {
    const tweetRef = useRef<HTMLQuoteElement>(null);

    useEffect(() => {
        if (window.twttr) {
            window.twttr.widgets.load(tweetRef.current);
        } else {
            const script = document.createElement("script");
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <blockquote ref={tweetRef} className="twitter-tweet p-2 border rounded-lg shadow-sm bg-gray-50">
            <a href={link.replace("x.com", "twitter.com")}></a>
        </blockquote>
    );
}

function EmbeddImage({ link }: { link: string }) {
    return <img src={link} alt="Embedded content" className="w-full rounded-lg shadow-md" />;
}

function EmbeddAudio({ link }: { link: string }) {
    return (
        <audio controls className="w-full mt-2 rounded-lg border border-gray-300">
            <source src={link} type="audio/mpeg" />
            Your browser doesn't support audio.
        </audio>
    );
}

export function Card(props: CardProps) {
    function embedd() {
        switch (props.type) {
            case "video":
                return <EmbeddVideo link={props.link} />;
            case "tweet":
                return <EmbeddTweet link={props.link} />;
            case "audio":
                return <EmbeddAudio link={props.link} />;
            case "image":
                return <EmbeddImage link={props.link} />;
            default:
                return null;
        }
    }

    return (
        <div className={`${defaultStyles} relative z-10`}>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <div className="flex items-center text-md font-semibold text-gray-700">
                    <a href={props.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-500">
                        <DocumentIcon />
                        <span>{props.title}</span>
                    </a>
                </div>
                <div className="flex items-center space-x-3">
                    <ShareIcon  />
                    <DeleteIcon contentId={props.contentId}  />
                </div>
            </div>
            <div className="pt-4 flex-grow">{embedd()}</div>
        </div>
    );
}