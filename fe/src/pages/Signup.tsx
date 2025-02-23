import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { Logo } from "../icons/Logo";

export function Signup(){
    const userRef=useRef<HTMLInputElement>(null);
    const passRef=useRef<HTMLInputElement>(null);
    const navigate=useNavigate();

    async function signup(){
        const username=userRef.current?.value;
        const password=passRef.current?.value;
        

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username,
            password:password
        })

        navigate("/signin");
        alert("You have signup");
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">

                <div className="flex items-center justify-center mb-6">
                    <Logo/>
                    <h1 className="text-xl font-bold text-gray-800">Second Brain</h1>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800">Create an Account</h2>
                <p className="text-gray-500 text-sm mb-6">Join us and start your journey</p>

                <div className="space-y-4">
                    <Input reference={userRef} placeholder="Username" type="text" />
                    <Input reference={passRef} placeholder="Password" type="password" />
                </div>

                <div className="mt-6">
                    <Button onClick={signup} variant="primary" text="Sign Up" width="w-full" loading={false} />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <a href="/signin" className="text-blue-500 font-medium hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );   
}