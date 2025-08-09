"use client";

import React from "react";
import "./HeroDesign.css";

export default function Hero() {
  return (
    <section className="hero-section">
      <video
        className="hero-video-bg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/wheelsshop/masinafundal1.webp"
        loading="eager"
        style={{
          filter: "grayscale(0.8) contrast(1.2) brightness(0.9) saturate(0.3)",
          objectFit: "cover",
          objectPosition: "center 60%",
        }}
      >
        <source src="/wheelsshop/HEROVIDEO.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <img
        src="/wheelsshop/Icon.svg"
        alt="logo"
        className="hero-logo-corner"
        loading="eager"
      />

      <div className="hero-center-content">
        <h1 className="hero-title-blur-centered">
          RIMS THAT DEFINE YOUR DRIVE
        </h1>
        <div
          className="hero-buttons-glass-center"
          style={{ justifyContent: "center" }}
        >
          <button
            className="hero-btn-liquid-glass"
            onClick={() => (window.location.href = "/products")}
          >
            View collection
          </button>
        </div>
      </div>
    </section>
  );
}
