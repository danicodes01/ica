"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import GameCanvas from "./_components/game/canvas";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  console.log('Home page - Current session status:', status);

  useEffect(() => {
    console.log('Home page useEffect - status:', status);
    if (status === "unauthenticated") {
      console.log('Redirecting to login...');
      router.replace("/login");
      router.refresh();
    }
  }, [status, router]);

  if (status === "loading") {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-[#888] text-sm">Loading...</span>
      </div>
    );
  }

  if (status !== "authenticated") {
    console.log('Not authenticated, returning null');
    return null;
  }

  console.log('Rendering authenticated home page');
  return (
    <main className="min-h-screen">
      <GameCanvas />
      <div className="fixed top-4 right-4">
        {/* Navigation, status, etc */}
      </div>
      <button
        className="fixed bottom-3 right-6 text-xs border border-solid border-black rounded text-blue-400 z-50"
        onClick={async () => {
          console.log('Sign out clicked');
          await signOut({ redirect: false });
          console.log('Signed out, redirecting...');
          router.replace("/login");
          router.refresh();
        }}
      >
        Sign Out
      </button>
    </main>
  );
}