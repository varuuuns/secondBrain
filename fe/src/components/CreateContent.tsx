import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface CreateContentProps{
    open:boolean;
    onClose:()=>void;
    onContentAdded:(newContent: any)=>void;
}

export function CreateContent({open,onClose,onContentAdded}:CreateContentProps){
    if(!open) return null;

    const titleRef=useRef<HTMLInputElement>(null);
    const linkRef=useRef<HTMLInputElement>(null);
    const tagRef=useRef<HTMLInputElement>(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState<string | null>(null);
    // link, title, type, tags

    async function addContent(){
        setError(null);
        setLoading(true);

        const title=titleRef.current?.value;
        const link=linkRef.current?.value;
        const tags=tagRef.current?.value?.split(",").map(tag => tag.trim());

        if(!title || !link){
            setError("title, link missin");
            setLoading(false);
            return;
        }

        let type:"image" | "video" | "audio" | "tweet" | "blogs" | "articles" | null = null;
    
        const imageExtensions = ["jpeg", "jpg", "gif", "tiff", "eps", "svg", "psd"];
        const videoExtensions = ["mp4", "mov", "avi", "mkv"];
        const audioExtensions = ["mp3", "wav", "ogg"];
        const tweetPatterns = ["twitter.com", "x.com"];
        const blogPatterns = ["medium.com", "substack.com"];
        const videoPatterns = ["youtube.com"];

        if (imageExtensions.some(ext => link?.toLowerCase().endsWith("." + ext))) type = "image";
        else if (videoExtensions.some(ext => link?.toLowerCase().endsWith("." + ext))) type = "video";
        else if (audioExtensions.some(ext => link?.toLowerCase().endsWith("." + ext))) type = "audio";
        else if (tweetPatterns.some(pattern => link?.includes(pattern))) type = "tweet";
        else if (videoPatterns.some(pattern => link?.includes(pattern))) type = "video";
        else if (blogPatterns.some(pattern => link?.includes(pattern))) type = "blogs";

        try{
            const response=await axios.post(`${BACKEND_URL}/api/v1/content`,{
                title:title,
                link:link,
                tags:tags,
                type:type
            },{
                headers:{
                    "Authorization":localStorage.getItem("Authorization")
                }
            })
            onContentAdded(response.data);
            onClose();
        }
        catch(err){
            console.log("Error",err);
            setError("add content failed");
        }
        finally{
            setLoading(false);
        }

    }

    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">

            <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-50" onClick={onClose}></div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg relative z-10 w-96">

                <div className="flex justify-end">
                    <button onClick={onClose} className="cursor-pointer">
                        <CrossIcon />
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="space-y-4">
                    <Input reference={titleRef} type="text" placeholder="Title" />
                    <Input reference={linkRef} type="text" placeholder="Link" />
                    <Input reference={tagRef} type="text" placeholder="Tags (comma-separated)" />
                </div>

                <div className="flex justify-center mt-4">
                    <Button onClick={addContent} variant="primary" text={loading ? "Submitting..." : "Submit"} loading={loading} />
                </div>
            </div>
        </div>
    )
}