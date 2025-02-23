import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";

export function useContent(){
    const [contents,setContents]=useState([]);
    
    async function reload(){
        const response=await axios.get(`${BACKEND_URL}/api/v1/content`,{
            headers:{
                "Authorization":localStorage.getItem("Authorization")
            }
        })
        setContents(response.data.Content);
    }

    return {contents,reload};
}