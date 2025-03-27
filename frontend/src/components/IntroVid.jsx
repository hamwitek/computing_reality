import React from "react";
import { useNavigate } from "react-router-dom";
import videoBg from "../assets/video_computing_reality.mp4"

export default function IntroVid() {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/projectstart');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src={videoBg}
          onError={(e) => {
            console.error("Error loading video:", e);
          }}
        />
      </div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center text-white"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <h2 className="text-4xl font-bold">AI-Powered Urban Planning</h2>
        <p className="text-lg mt-4">
          Analyze ortho images and export 3D tree models to AutoCAD & Rhino.
        </p>
        <button 
          onClick={handleClick}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
