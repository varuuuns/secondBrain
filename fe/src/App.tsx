import { Dashboard } from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { SharedPage } from "./pages/SharedPage";
import { Home } from "./pages/Home";


// i should create a new component for this

function SharedPageWrapper(){
    const { shareLink }=useParams();
    const [data,setData]=useState<{ username: string; content: any[] } | null>(null);

    useEffect(()=>{
        async function fetched(){
            try{
                const response=await axios.get(`${BACKEND_URL}/api/v1/brain/${shareLink}`);
                setData(response.data);
            }
            catch(err){
                console.log("Error",err);
            }
        }
        fetched();
    },[shareLink]);

    if(!data) return( <div> Loading... </div> )
    
    return <SharedPage username={data.username} content={data.content}/>
}

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/signup" element=<Signup/> />
                <Route path="/signin" element=<Signin/> />
                <Route path="/dashboard" element=<Dashboard/> />
                <Route path="/share/:shareLink" element={<SharedPageWrapper />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;