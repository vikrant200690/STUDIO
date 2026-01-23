import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEnvelope, FaEyeSlash } from "react-icons/fa";

const icons = {
  username: <FaUser />,
  password: <FaLock />,
  email: <FaEnvelope />,
};

function InputField({
  type = "text",
  name,
  placeholder,
  iconType = "username",
  value,
  onChange,
  ...props
}) {


const [showPassword, setShowPassword] = useState(false);
const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative mb-5 w-full">
      {/* Icon */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
        {icons[iconType]}
      </span>

      {/* Input */}
      <input
        type={type ==="password" && showPassword ? "text": type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          bg-slate-700/80
          text-white
          placeholder-gray-400
          pl-12 pr-4 py-3.5
          border border-slate-600
          focus:outline-none
          focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500
          transition-all duration-200
        "
        {...props}/>

        {type === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
      
    </div>
  );
}

export default InputField;
