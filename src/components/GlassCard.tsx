"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import OptimizedImage from "./OptimizedImage";

const IVULogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
    <text
      x="50"
      y="60"
      textAnchor="middle"
      fontSize="40"
      fontWeight="bold"
      fontFamily="Gruppo, Arial, sans-serif"
      fill="currentColor"
    >
      IVU
    </text>
  </svg>
);

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  wheel?: {
    id: number;
    name: string;
    price: number;
    images: string[];
  };
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = "", wheel, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const getFirstImage = (images: string[]) => {
      return images.find((img) => img.includes("1")) || images[0];
    };

    return (
      <div
        ref={ref}
        style={{
          height: isMobile ? "200px" : "350px",
          width: isMobile ? "150px" : "290px",
          perspective: "1000px",
          ...props.style,
        }}
        className={className}
        {...props}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            borderRadius: "30px",
            background: "linear-gradient(135deg, #18181b, #000000)",
            boxShadow: isHovered
              ? "rgba(0,0,0,0.3) 30px 50px 25px -40px, rgba(0,0,0,0.1) 0px 25px 30px 0px"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transformStyle: "preserve-3d",
            transform: isHovered ? "rotate3d(1,1,0,15deg)" : "none",
            willChange: "transform, box-shadow",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "8px",
              borderRadius: "25px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
              background:
                "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              transformStyle: "preserve-3d",
              transform: "translate3d(0,0,25px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              right: "8px",
              bottom: isMobile ? "50px" : "80px",
              transform: "translate3d(0,0,26px)",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "100%",
                width: "100%",
                overflow: "hidden",
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
              }}
            >
              {wheel && (
                <OptimizedImage
                  src={`/wheels2/${getFirstImage(wheel.images)}`}
                  alt={wheel.name}
                  loading="eager"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                    filter: "brightness(1.15) contrast(1.1) saturate(1.1)",
                    padding: "10px",
                    opacity: 1,
                    transition: "transform 0.3s ease",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                  }}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%, rgba(255, 255, 255, 0.02) 100%)",
                }}
              />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "50px",
              left: 0,
              right: 0,
              transform: "translate3d(0,0,26px)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: isMobile ? "18px" : "24px",
                fontWeight: "bold",
                color: "white",
                fontFamily: "Gruppo, Arial, sans-serif",
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              €{wheel?.price || "599"}
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              transformStyle: "preserve-3d",
              transform: "translate3d(0,0,26px)",
            }}
          >
            <div
              style={{
                display: "flex",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease-in-out",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                padding: "8px 16px",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate3d(0,0,10px)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate3d(0,0,0px)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <button
                style={{
                  border: "none",
                  background: "none",
                  fontSize: isMobile ? "11px" : "13px",
                  fontWeight: "bold",
                  color: "white",
                  fontFamily: "Gruppo, Arial, sans-serif",
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
              <svg
                style={{
                  marginLeft: "6px",
                  height: "14px",
                  width: "14px",
                  stroke: "white",
                  strokeWidth: "2.5",
                  fill: "none",
                }}
                viewBox="0 0 24 24"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              transformStyle: "preserve-3d",
              transform: "translate3d(0,0,30px)",
            }}
          >
            <div
              style={{
                display: "grid",
                placeContent: "center",
                width: isMobile ? "24px" : "32px",
                height: isMobile ? "24px" : "32px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <IVULogo
                style={{ width: isMobile ? "12px" : "18px", fill: "black" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
