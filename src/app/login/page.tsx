"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { setUser } from "../../lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Login failed");
        return;
      }
      setUser({
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        createdAt: data.user.createdAt,
      });
      try {
        window.dispatchEvent(new Event("auth-updated"));
      } catch {}
      router.push("/user");
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "1rem" : "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      {/* Main Container */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(25px)",
          borderRadius: isMobile ? "20px" : "28px",
          padding: isMobile ? "1.5rem" : "2.5rem",
          width: "100%",
          maxWidth: isMobile ? "340px" : "420px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow:
            "0 25px 50px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          position: "relative",
          zIndex: 1,
          margin: "auto",
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "1.5rem" : "2rem",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: isMobile ? "1.8rem" : "2.2rem",
              fontWeight: "300",
              margin: 0,
              letterSpacing: "2px",
            }}
          >
            IVU
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              margin: "0.3rem 0 0 0",
              letterSpacing: "1px",
            }}
          >
            WHEELS
          </p>
        </div>

        {/* Welcome Text */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "1.5rem" : "2rem",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: isMobile ? "1.5rem" : "1.7rem",
              fontWeight: "300",
              margin: "0 0 0.3rem 0",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: isMobile ? "0.85rem" : "0.95rem",
              margin: 0,
            }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: isMobile ? "1.2rem" : "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: isMobile ? "0.85rem" : "0.9rem",
                marginBottom: "0.4rem",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: isMobile ? "0.75rem 0.9rem" : "0.875rem 1rem",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "14px",
                color: "white",
                fontSize: isMobile ? "0.95rem" : "1rem",
                outline: "none",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                e.target.style.background = "rgba(255, 255, 255, 0.12)";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 255, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.target.style.background = "rgba(255, 255, 255, 0.08)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: isMobile ? "1.2rem" : "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: isMobile ? "0.85rem" : "0.9rem",
                marginBottom: "0.4rem",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: isMobile ? "0.75rem 0.9rem" : "0.875rem 1rem",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "14px",
                color: "white",
                fontSize: isMobile ? "0.95rem" : "1rem",
                outline: "none",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                e.target.style.background = "rgba(255, 255, 255, 0.12)";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 255, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.target.style.background = "rgba(255, 255, 255, 0.08)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isMobile ? "1.5rem" : "2rem",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "0.8rem" : "0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                marginBottom: "0",
              }}
            >
              <label className="container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className="checkmark"></div>
              </label>
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: isMobile ? "0.85rem" : "0.9rem",
                }}
              >
                Remember me
              </span>
            </div>
            <Link
              href="/forgot-password"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: isMobile ? "0.85rem" : "0.9rem",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255, 255, 255, 0.8)";
              }}
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div
              style={{
                color: "#ff9999",
                marginBottom: "1rem",
                fontSize: isMobile ? "0.85rem" : "0.9rem",
                textAlign: "center",
                padding: "0.5rem",
                background: "rgba(255, 0, 0, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 0, 0, 0.2)",
              }}
            >
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: isMobile ? "0.9rem" : "1rem",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "14px",
              color: "white",
              fontSize: isMobile ? "0.95rem" : "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              marginBottom: isMobile ? "1.2rem" : "1.5rem",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Sign in
          </button>

          {/* Sign Up Link */}
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "1rem" : "1.5rem",
            }}
          >
            <span
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: isMobile ? "0.85rem" : "0.9rem",
              }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                }}
              >
                Sign up
              </Link>
            </span>
          </div>
        </form>

        {/* Back to Home */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/"
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: isMobile ? "0.8rem" : "0.85rem",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(255, 255, 255, 0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(255, 255, 255, 0.5)";
            }}
          >
            ← Back to IVU Wheels
          </Link>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            try{
              var u = JSON.parse(localStorage.getItem('user')||'null');
              if(u){
                var forms = document.getElementsByTagName('form');
                if(forms[0]){
                  var btn = forms[0].querySelector('button[type=submit]');
                  if(btn){
                    btn.type='button';
                    btn.onclick=function(){ window.location.href='/products'; };
                    btn.textContent='Go shopping';
                  }
                }
              }
            }catch(e){}
          })();
        `,
        }}
      />

      {/* Footer - positioned at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 0,
        }}
      ></div>
    </div>
  );
}
