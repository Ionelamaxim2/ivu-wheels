"use client";

import React, { useState, useEffect } from "react";

import "./HeroDesign.css";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const detectMobile = () => {
      try {
        const mq = window.matchMedia("(max-width: 820px)").matches;
        const ua = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        setIsMobile(mq || ua);
      } catch {
        setIsMobile(window.innerWidth <= 820);
      }
    };

    detectMobile();
    window.addEventListener("resize", detectMobile);
    return () => window.removeEventListener("resize", detectMobile);
  }, []);

  return (
    <section className="hero-section">
      {isMobile ? (
        <video
          key="mobile"
          className="hero-video-bg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/wheelsshop/masinafundal1.webp"
          style={{
            objectFit: "cover",
            objectPosition: "center 60%",
            filter: "grayscale(1) contrast(1.1) brightness(0.9)",
          }}
          disablePictureInPicture
        >
          <source src="/wheelsshop/HEROVIDEO.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <video
          key="desktop"
          className="hero-video-bg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/wheelsshop/masinafundal1.webp"
          style={{
            filter:
              "grayscale(0.8) contrast(1.2) brightness(0.9) saturate(0.3)",
            objectFit: "cover",
            objectPosition: "center 60%",
          }}
          disablePictureInPicture
        >
          <source src="/wheelsshop/masinafundalpc.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <img
        src="/wheelsshop/Icon.svg"
        alt="logo"
        className="hero-logo-corner"
        loading="eager"
        decoding="async"
      />

      <div className="hero-center-content">
        <h1
          className="hero-title-blur-centered"
          style={{ fontFamily: "Gruppo, Arial, sans-serif" }}
        >
          RIMS THAT DEFINE YOUR DRIVE
        </h1>
        <div
          className="hero-buttons-glass-center"
          style={{ justifyContent: "center" }}
        >
          <a className="hero-btn-liquid-glass" href="/products">
            View collection
          </a>
        </div>
      </div>
    </section>
  );
}
