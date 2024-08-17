import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Spinner } from "flowbite-react";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [showPassword,setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.username) {
      return setErrorMessage("Please fill out all the fields");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  return (
    <div className="w-100% h-[calc(100vh-70px)] flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 w-[80%] sm:w-[400px]">
        <h2 className="logo p-1 text-3xl md:text-4xl h-fit bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent  ">
          Instagram
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full items-center">
        <div className="flex gap-6 md:gap-2 flex-col md:flex-row w-full">
        <input
          className="border border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md"
          type="text"
          placeholder="name"
          id="name"
          onChange={handleChange}
        />
        <input
          className="border border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md"
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
        />
        </div>
        <input
          className="border border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md"
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <div className="w-full relative">
        <input
          className="border border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md"
          type={`${showPassword ? "text" : "password"}`}
          id="password"
          placeholder="••••••••"
          onChange={handleChange}
        />
        <div className="absolute right-2 text-gray-500 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">
        {
          showPassword ? <IoIosEyeOff onClick={() => setShowPassword(!showPassword)} /> : <IoMdEye onClick={() => setShowPassword(!showPassword)}/>
        }
        </div>
        </div>
        <button type="submit" className="w-full py-2 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-md text-md font-medium " disabled={loading}>
          {loading  ? (
            <>
            <Spinner size={"sm"} />
            <span className="pl-3">Loading...</span>
          </>
          ) : "Sign up"}
        </button>
        </form>
        <h5>
          Already have an Account?{" "}
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </h5>
      {errorMessage && (
            <Alert className="mt-4" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
      </div>
    </div>
  );
}
