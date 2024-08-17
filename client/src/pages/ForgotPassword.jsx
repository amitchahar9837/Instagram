import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Spinner } from "flowbite-react";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setErrorMessage("email is required");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        navigate("/reset-password", { state: { email } });
      } else {
        setLoading(false);
        setErrorMessage(data.message);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };
  return (
    <div className="w-100% h-[calc(100vh-70px)] flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 w-[80%] sm:w-[400px]">
        <h2 className="logo p-1 text-3xl md:text-4xl h-fit bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent  ">
          Instagram
        </h2>
        <h3 className="text-2xl font-semibold">Forgot password?</h3>
        <p className="text-md text-slate-500">
          No worries, we'll send you reset token
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full items-center"
        >
          <input
            className="border border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-md text-md font-medium "
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size={"sm"} />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Next"
            )}
          </button>
        </form>
        <Link
          to={"/sign-in"}
          className="text-gray-500 flex items-center gap-2"
        >
          <IoMdArrowRoundBack className="text-lg" />
          <h3>Back to Sign In</h3>
        </Link>
        {errorMessage && (
          <Alert className="mt-4" color={"failure"}>
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
