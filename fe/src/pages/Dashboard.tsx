import { Button } from "../components/Button"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { Card } from "../components/Card"
import { useEffect, useState } from "react"
import { CreateContent } from "../components/CreateContent"
import { Sidebar } from "../components/Sidebar"
import { useContent } from "../hooks/useContent"
import axios from "axios"
import { BACKEND_URL } from "../config"

export function Dashboard() {
    const [open,setOpen]=useState(false);
    const {contents,reload}=useContent();

    useEffect(()=>{ reload()  },[open]);

    async function share(){
        try{
            const response=await axios.post(`${BACKEND_URL}/api/v1/brain/share`,{
                data:{ share:true },
            });
            console.log("token", localStorage.getItem("Authorization"));
            console.log(response.data);
            // if(response.data.link){ 
            //     await navigator.clipboard.writeText(response.data.link);
            //     alert("link's copied to clippy");
            // }
            // else alert("link not generated");
        }
        catch(err){
            console.log("Error",err);
            alert("please try again, error happend");
        }
    }

    async function varun(){
        const response=await axios.post(`${BACKEND_URL}/api/v1/brain/share`,{
            data:{ share:false},
        })
        console.log(response);
    }

    return (
        <div className="bg-gray-100">
            <div>
                <Sidebar />
            </div>
    
            <div className="p-4 ml-72 min-h-screen bg-gray-100 relative">
                
                {open && (
                    <div className="fixed inset-0 flex items-center justify-cente bg-opacity-50 z-50">
                        <CreateContent open={open} onClose={() => setOpen(false)} onContentAdded={reload} />
                    </div>
                )}
    
                <div className="flex justify-end space-x-4 mb-6 w-full">
                    <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />} onClick={share} />
                    <Button onClick={() => setOpen(true)} variant="primary" text="Add Content" startIcon={<PlusIcon />} />
                    <Button variant="secondary" text="Dlt share" onClick={varun} />
                </div>
    
                <div className="flex gap-4 flex-wrap">
                    {contents.map(({ _id, title, link, type }) => (
                        <Card key={_id} contentId={_id} title={title} link={link} type={type} />
                    ))}
                </div>
            </div>
        </div>
    );    
}