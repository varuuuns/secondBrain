import { ReactElement } from "react";

interface ButtonProps{
    variant:"primary" | "secondary";
    text:string;
    startIcon?:ReactElement;
    onClick?: ()=>void;
    width?:string;
    loading?:boolean;
}

const variantStyles = {
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "bg-purple-200 text-purple-600 hover:bg-purple-300"
};

const defaultStyles= "px-4 py-2 rounded-md font-light flex items-center justify-center select-none cursor-pointer"

export function Button(props:ButtonProps){
    return(
        <button onClick={props.onClick} className={` ${variantStyles[props.variant]} ${defaultStyles} cursor-pointer ${props.width} ${props.loading ? "opacity-45" : ""}`}>
            <div className="pr-2">
                {props.startIcon}
            </div>
            {props.text}
        </button>
    )
}