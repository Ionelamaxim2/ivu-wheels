"use client";
import { useState, useEffect } from "react";

export default function StatsSection() {
  const stats = [
    { number: 2500, suffix: "+", label: "WHEELS SOLD" },
    { number: 25, suffix: "", label: "COUNTRIES" },
    { number: 70, suffix: "+", label: "MODELS" },
    { number: 15, suffix: "+", label: "YEARS OF EXPERIENCE" },
  ];

  const [animatedNumbers, setAnimatedNumbers] = useState(stats.map(() => 0));
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      const increment = stat.number / 100;
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= stat.number) {
          current = stat.number;
          clearInterval(timers[index]);
        }

        setAnimatedNumbers((prev) => {
          const newNumbers = [...prev];
          newNumbers[index] = Math.floor(current);
          return newNumbers;
        });
      }, 20);
    });

    return () => timers.forEach((timer) => clearInterval(timer));
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#1a1a1a",
        padding: "4rem 0 2rem 0",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        {/* Stats Container with Gray Background */}
        <div
          style={{
            background: "rgba(128, 128, 128, 0.4)",
            borderRadius: isMobile ? "15px" : "25px",
            padding: isMobile ? "2rem 1rem" : "3rem 2rem",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap",
            gap: isMobile ? "1rem" : "2rem",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                minWidth: isMobile ? "120px" : "200px",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "2rem" : "3rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  color: "white",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {animatedNumbers[index]}
                {stat.suffix}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "0.7rem" : "0.85rem",
                  color: "#ccc",
                  letterSpacing: isMobile ? "1px" : "2px",
                  fontWeight: "400",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Title Section */}
        <div
          style={{
            textAlign: "center",
            marginTop: "4rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              fontWeight: "300",
              color: "white",
              margin: 0,
              fontFamily: "Gruppo, Arial, sans-serif",
            }}
          >
            Find the Perfect Wheels for You
          </h2>
        </div>
      </div>
    </section>
  );
}
