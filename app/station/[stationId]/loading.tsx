export default function StationLoading() {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-[color:var(--game-text)] font-ps2p animate-pulse">
          Entering Station...
        </div>
      </div>
    );
  }