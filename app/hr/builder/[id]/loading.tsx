"use client";
import { Player } from "@lottiefiles/react-lottie-player";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <Player src="/block_builder.json" className="player" loop autoplay />
      <div className="text-gray-500 text-sm">Loading builder ...</div>
    </div>
  );
}

export default Loading;
