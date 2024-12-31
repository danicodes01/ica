"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/register";

export default function Register() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const name = formData.get("name") as string | null;

    // Handle case where any field is empty
    if (!email || !password || !name) {
      setError("All fields are required.");
      return;
    }

    const r = await register({
      email: email ?? "",  // Default to empty string if null
      password: password ?? "",
      name: name ?? "",
    });

    ref.current?.reset();
    if (r?.error) {
      setError(r.error);
      return;
    } else {
      return router.push("/login");
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-1xl font-bold text-white">Welcome to the intergalactic code academy</h1>
          <span className="text-xl inline-block my-1">🛸</span>
        </div>

        <form ref={ref} onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-1.5 text-sm text-center text-red-500 bg-red-100 bg-opacity-10 rounded">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-3 text-white bg-transparent border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Sign Up
          </button>

          <div className="text-center pt-1">
            <Link
              href="/login"
              className="text-white hover:underline text-sm inline-block"
            >
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}