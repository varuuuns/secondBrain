interface InputProps {
    placeholder: string;
    type: string;
    reference?: any;
}

export function Input(props: InputProps) {
    return (
        <div className="w-full flex justify-center">
            <input 
                type={props.type} 
                ref={props.reference} 
                className="w-4/5 outline-purple-500 px-4 py-2 border border-gray-300 rounded-md m-2" 
                placeholder={props.placeholder} 
            />
        </div>
    );
}
