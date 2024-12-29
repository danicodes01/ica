"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import GameCanvas from "./_components/game/canvas";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  // Ensure that the user is authenticated before proceeding to the game canvas
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Render loading state while the session is loading
  if (status === "loading") {
    return <span className="text-[#888] text-sm mt-7">Loading...</span>;
  }

  // Render the game and sign out button if the user is authenticated
  return (
    <main className="min-h-screen">
      <GameCanvas />
      {/* Floating UI elements */}
      <div className="fixed top-4 right-4">
        {/* Navigation, status, etc */}
      </div>
      <button
        className="fixed bottom-3 right-6 text-xs border border-solid border-black rounded text-blue-400 z-50"
        onClick={() => {
          signOut({ redirect: false }).then(() => {
            router.push("/");
          });
        }}
      >
        Sign Out
      </button>
    </main>
  );
}
