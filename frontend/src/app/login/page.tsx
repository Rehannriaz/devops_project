"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "../api/userService"; // Adjust the import path as needed

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await userService.login({ email, password });

      // Assuming the server returns a token and userId
      const { token, userId } = response;

      // Store the token in localStorage (or use a more secure method in production)
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Redirect to the notes page
      router.push("/notes");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-[60%]">
        <div className="flex rounded-[12px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          <div className="left w-1/2 p-6">
            <h2 className="text-[#841bfd] text-[34px] text-center font-bold capitalize">
              Log In
            </h2>
            <form onSubmit={handleLogin}>
              <label
                htmlFor="email"
                className="block text-[18px] text-[#841bfd] font-medium mt-4">
                Email *
              </label>
              <input
                className="border border-[#841bfd] rounded-[6px] w-full p-1 mt-2 text-[#841bfd]"
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label
                htmlFor="password"
                className="block text-[18px] text-[#841bfd] font-medium mt-4">
                Password *
              </label>
              <input
                className="border border-[#841bfd] rounded-[6px] w-full p-1 mt-2 text-[#841bfd]"
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <div className="my-8 text-center">
                <button
                  type="submit"
                  className="bg-[#841bfd] hover:bg-[#9253d9] px-8 py-2 text-white text-[18px] rounded-[16px]">
                  Log In
                </button>
              </div>
            </form>
          </div>
          <div className="right w-1/2 bg-[url('/images/back.png')] p-6 bg-center bg-cover bg-no-repeat">
            <h2 className="text-white text-[34px] text-center font-bold capitalize">
              Welcome Back to NoteMaster
            </h2>
            <p className="text-white mt-8 text-[22px]">
              Keep your thoughts organized and accessible. Log in to access your
              notes, ideas, and inspirations anytime, anywhere.
            </p>
            <div className="my-8 text-center">
              <Link
                href="/signup"
                className="px-8 py-2 text-[#841bfd] hover:bg-slate-300 text-[18px] rounded-[16px] bg-white  ">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
