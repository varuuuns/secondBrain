import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Welcome to Second Brain</h1>

            <div className="flex space-x-4">
                <Button variant="primary" text="Sign In" onClick={() => navigate("/signin")} width="w-40"/>
                <Button variant="secondary" text="Sign Up" onClick={() => navigate("/signup")} width="w-40"/>
            </div>
        </div>
    );
}
