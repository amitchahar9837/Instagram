import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Spinner } from "flowbite-react";
import { IoIosEyeOff, IoMdArrowRoundBack, IoMdEye } from "react-icons/io";

export default function ResetPassword() {
  const navigate = useNavigate();
  const {state} = useLocation();
  const [loading,setLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState(null);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword,setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      return setErrorMessage("all fields are required");
    }
    try {
         setLoading(true)
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token, password: newPassword}),
      });

      const data = await res.json();
      if(res.ok){
            setLoading(false);
            navigate('/sign-in')
      }else{
         setLoading(false)
         setErrorMessage(data.message);
      }
    } catch (error) {
         setLoading(false)
      setErrorMessage(error.message);
    }
  };
  return (
    <div className="w-100% h-[calc(100vh-70px)] flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 w-[80%] sm:w-[400px]">
        <h2 className="logo p-1 text-3xl md:text-4xl h-fit bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent  ">
          Instagram
        </h2>
        <h3 className="text-2xl font-semibold">Reset Password</h3>
        <p className="text-md text-slate-500 text-center">We have sent reset token to your <span className="font-semibold">{state?.email}</span> <Link to={"/forgot-password"} className="text-red-400">Change email?</Link> </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full items-center">
        <input
          className="border border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md"
          type="text"
          placeholder="Enter 6 digit token"
          onChange={(e)=>setToken(e.target.value)}
        />
        <div className="w-full relative">
        <input
          className="border border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md"
          type={`${showPassword ? "text" : "password"}`}
          placeholder="Enter new password"
          onChange={(e)=>setNewPassword(e.target.value)}
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
          ) : "Reset Password"}
        </button>
        </form>
      {errorMessage && (
            <Alert className="mt-4" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
      </div>
    </div>
  );
}
