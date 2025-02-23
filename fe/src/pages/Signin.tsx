import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { Logo } from "../icons/Logo";

export function Signin(){
    
    const userRef=useRef<HTMLInputElement>(null);
    const passRef=useRef<HTMLInputElement>(null);
    const navigate=useNavigate();

    async function signin(){
        const username=userRef.current?.value;
        const password=passRef.current?.value;
        

        const temp=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username,
            password:password
        })

        localStorage.setItem("Authorization",temp.data.Authorization); 
        navigate("/dashboard");
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
                
                <div className="flex items-center justify-center mb-6">
                    <Logo />
                    <h1 className="text-xl font-bold text-gray-800">Second Brain</h1>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
                <p className="text-gray-500 text-sm mb-6">Sign in to continue</p>

                <div className="space-y-4">
                    <Input reference={userRef} placeholder="Username" type="text" />
                    <Input reference={passRef} placeholder="Password" type="password" />
                </div>

                <div className="mt-6">
                    <Button onClick={signin} variant="primary" text="Sign In" width="w-full" loading={false} />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-500 font-medium hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );   
}