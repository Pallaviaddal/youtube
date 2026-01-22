// app/call/page.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CallPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    let stream: MediaStream;

    async function startPreview() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err: unknown) {
        const errorMessage = typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : String(err);
        console.warn("Camera blocked:", errorMessage);
      }
    }

    if (camOn) startPreview();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [camOn]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-xl font-semibold mb-4">Video Call</h1>

        <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          {/* Remote placeholder */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-white/10 grid place-items-center">
                <span className="text-lg font-semibold">A</span>
              </div>
              <p className="mt-3 text-sm font-semibold">Remote Participant</p>
              <p className="text-xs text-white/60">(Demo UI)</p>
            </div>
          </div>

          {/* Local preview */}
          <div className="absolute bottom-4 right-4 w-44 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg sm:w-56">
            <div className="aspect-video w-full">
              {camOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center bg-white/5">
                  <p className="text-xs text-white/70">Camera Off</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-xs text-white/70">
              <span>You</span>
              <span className="rounded-md bg-white/10 px-2 py-0.5">
                {micOn ? "Mic On" : "Mic Off"}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-neutral-950/60 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 px-4 py-3">
              <button
                onClick={() => setMicOn((v) => !v)}
                className={`rounded-xl px-5 py-3 text-sm font-medium border ${
                  micOn ? "bg-white/15 border-white/15" : "bg-white/5 border-white/10"
                } hover:bg-white/10`}
              >
                Mic: {micOn ? "On" : "Off"}
              </button>

              <button
                onClick={() => setCamOn((v) => !v)}
                className={`rounded-xl px-5 py-3 text-sm font-medium border ${
                  camOn ? "bg-white/15 border-white/15" : "bg-white/5 border-white/10"
                } hover:bg-white/10`}
              >
                Cam: {camOn ? "On" : "Off"}
              </button>

              <button
                onClick={() => alert("Demo: End call")}
                className="ml-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold hover:bg-red-500"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
