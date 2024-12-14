"use client"
import React, { useState } from "react";
import Link from "next/link";
import { userService } from "../api/userService"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await userService.signup({
        name,
        username,
        email,
        password,
      });
      console.log("Signup successful:", result);
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to signup. Please try again."
      );
    }
  };
  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-[60%]">
        <div className="flex rounded-[12px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          <div className="left w-1/2 p-6">
            <h2 className="text-[#841bfd] text-[34px] text-center font-bold capitalize">
              Sign Up
            </h2>
            <form onSubmit={handleSignup}>
              <label
                htmlFor="name"
                className="block text-[18px] text-[#841bfd] font-medium mt-4">
                Name *
              </label>
              <input
                className="border border-[#841bfd] rounded-[6px] w-full p-1 mt-2 text-[#841bfd]"
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label
                htmlFor="username"
                className="block text-[18px] text-[#841bfd] font-medium mt-4">
                Username *
              </label>
              <input
                className="border border-[#841bfd] rounded-[6px] w-full p-1 mt-2 text-[#841bfd]"
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="ConfirmPassword"
                className="block text-[18px] text-[#841bfd] font-medium mt-4">
                Confirm Password *
              </label>
              <input
                className="border border-[#841bfd] rounded-[6px] w-full p-1 mt-2 text-[#841bfd]"
                type="password"
                id="ConfirmPassword"
                name="ConfirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}
              <div className="my-8 text-center">
                <button
                  type="submit"
                  className="bg-[#841bfd] hover:bg-[#9253d9] px-8 py-2 text-white text-[18px] rounded-[16px]">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
          <div className="right w-1/2 bg-[url('/images/back.png')] p-6 bg-center bg-cover bg-no-repeat">
            <h2 className="text-white text-[32px] text-center font-bold capitalize">
              Welcome to NoteMaster
            </h2>
            <p className="text-white mt-8 text-[22px]">
              Keep your thoughts organized and accessible. Sign Up to create
              notes, ideas, and inspirations anytime, anywhere.
            </p>
            <div className="my-8 text-center">
              <Link
                href="/login"
                className="px-8 py-2 text-[#841bfd] hover:bg-slate-300 text-[18px] rounded-[16px] bg-white">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
