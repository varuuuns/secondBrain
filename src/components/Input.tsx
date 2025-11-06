interface InputProps {
    placeholder: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    reference?: React.Ref<HTMLInputElement>;
    className?: string; // for extra styles if needed
}

export function Input({
    placeholder,
    type = "text",
    value,
    onChange,
    reference,
    className = "",}: InputProps) {
    return (
        <div className="w-full flex justify-center">
        <input
            type={type}
            ref={reference}
            value={value}
            onChange={onChange}
            className={`w-4/5 outline-purple-500 px-4 py-2 border border-gray-300 rounded-md m-2 ${className}`}
            placeholder={placeholder}
        />
        </div>
    );
}
