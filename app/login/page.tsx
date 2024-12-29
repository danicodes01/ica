'use client';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Extract email and password from the form
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false, // Prevent automatic redirection
    });

    if (res?.error) {
      setError(res.error);
    } else if (res?.ok) {
      router.push('/'); // Redirect to the home page
    }
  };
  return (
    <div className="h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-1xl font-bold text-white">Welcome to the intergalactic space academy</h1>
          <span className="text-xl inline-block my-1">🛸</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-1.5 text-sm text-center text-red-500 bg-red-100 bg-opacity-10 rounded">
              {error}
            </div>
          )}

          <div className="space-y-3">
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
            Login
          </button>

          <div className="text-center pt-1">
            <Link
              href="/register"
              className="text-white hover:underline text-sm inline-block"
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}