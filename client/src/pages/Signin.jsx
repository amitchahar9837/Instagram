import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import { Alert, Spinner } from "flowbite-react";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const [showPassword,setShowPassword] = useState(false);
  const {loading, error:errorMessage} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return dispatch(signInFailure("Please fill out all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
       return dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        navigate("/");
        return dispatch(signInSuccess(data));
      }
    } catch (error) {
     return  dispatch(signInFailure(error.message))
    }
  };
  return (
    <div className="w-100% h-[calc(100vh-70px)] flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 w-[80%] sm:w-[400px]">
        <h2 className="logo p-1 text-3xl md:text-4xl h-fit bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent  ">
          Instagram
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full items-center">
        <input
          className="border border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md"
          type="text"
          placeholder="username"
          id="username"
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
          ) : "Sign in"}
        </button>
        </form>
        <Link to={"/forgot-password"} className="text-red-500">
          Forgotten Password?
        </Link>
        <h5>
          Don't have an Account?{" "}
          <Link to={"/sign-up"} className="text-blue-500 hover:underline">
            Sign up
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
