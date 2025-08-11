"use client";

import React, { useState, useEffect } from "react";

import "./HeroDesign.css";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="hero-section">
      {isMobile ? (
        <img
          src="/wheelsshop/masinafundal1.webp"
          alt="IVU Wheels hero"
          className="hero-video-bg"
          style={{ objectFit: "cover", objectPosition: "center 60%" }}
          loading="eager"
          decoding="async"
        />
      ) : (
        <video
          key={isMobile ? "mobile" : "desktop"}
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
          }}
          disablePictureInPicture
        >
          <source src={"/wheelsshop/masinafundalpc.mp4"} type="video/mp4" />
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
        <h1 className="hero-title-blur-centered">
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
