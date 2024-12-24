import GameCanvas from "./_components/game/canvas";
export default function Home() {
  return (
    <main className="min-h-screen">
      <GameCanvas />
      {/* Floating UI elements */}
      <div className="fixed top-4 right-4">
        {/* Navigation, status, etc */}
      </div>
    </main>
  );
}