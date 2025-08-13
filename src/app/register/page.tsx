"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { setUser, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [apiError, setApiError] = useState<string>("");
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const u = getUser();
    if (u) setAlreadyLogged(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof RegisterForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    if (apiError) setApiError("");
  };

  const validateForm = () => {
    const newErrors: Partial<RegisterForm> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.acceptTerms) newErrors.acceptTerms = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        setApiError(data?.error || "Registration failed");
        setErrors((prev) => ({ ...prev, email: data?.error || prev.email }));
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
      setApiError("Server error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "1rem" : "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(25px)",
          borderRadius: isMobile ? "20px" : "28px",
          padding: isMobile ? "1.5rem" : "2.5rem",
          width: "100%",
          maxWidth: isMobile ? "380px" : "480px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow:
            "0 25px 50px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          position: "relative",
          zIndex: 1,
          margin: "auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "1.2rem" : "1.8rem",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: isMobile ? "1.6rem" : "2rem",
              fontWeight: 300,
              letterSpacing: 1.5,
              margin: 0,
            }}
          >
            Create account
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              marginTop: 6,
              fontSize: isMobile ? "0.85rem" : "0.9rem",
            }}
          >
            Or{" "}
            <Link
              href="/login"
              style={{
                color: "white",
                textDecoration: "none",
                transition: "opacity 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
              }}
            >
              sign in
            </Link>
          </p>
        </div>

        {apiError ? (
          <div
            style={{
              color: "#ff9999",
              marginBottom: isMobile ? 12 : 16,
              fontSize: isMobile ? "0.85rem" : "0.9rem",
              textAlign: "center",
              padding: "0.5rem",
              background: "rgba(255, 0, 0, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 0, 0, 0.2)",
            }}
          >
            {apiError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: isMobile ? 12 : 14 }}>
            <div
              style={{
                display: "grid",
                gap: isMobile ? 12 : 14,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              }}
            >
              <div>
                <label
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: isMobile ? 13 : 14,
                    display: "block",
                    marginBottom: "0.4rem",
                  }}
                >
                  First Name *
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: isMobile ? "0.7rem 0.9rem" : "0.8rem 1rem",
                    background: "rgba(255,255,255,0.08)",
                    border: `1px solid ${
                      errors.firstName ? "#ff9999" : "rgba(255,255,255,0.2)"
                    }`,
                    borderRadius: 14,
                    color: "white",
                    outline: "none",
                    fontSize: isMobile ? "0.95rem" : "1rem",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    if (!errors.firstName) {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                      e.target.style.background = "rgba(255, 255, 255, 0.12)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.firstName) {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                      e.target.style.background = "rgba(255, 255, 255, 0.08)";
                    }
                  }}
                />
                {errors.firstName && (
                  <div
                    style={{
                      color: "#ff9999",
                      fontSize: isMobile ? 12 : 13,
                      marginTop: 4,
                    }}
                  >
                    {errors.firstName}
                  </div>
                )}
              </div>
              <div>
                <label
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: isMobile ? 13 : 14,
                    display: "block",
                    marginBottom: "0.4rem",
                  }}
                >
                  Last Name *
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: isMobile ? "0.7rem 0.9rem" : "0.8rem 1rem",
                    background: "rgba(255,255,255,0.08)",
                    border: `1px solid ${
                      errors.lastName ? "#ff9999" : "rgba(255,255,255,0.2)"
                    }`,
                    borderRadius: 14,
                    color: "white",
                    outline: "none",
                    fontSize: isMobile ? "0.95rem" : "1rem",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    if (!errors.lastName) {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                      e.target.style.background = "rgba(255, 255, 255, 0.12)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.lastName) {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                      e.target.style.background = "rgba(255, 255, 255, 0.08)";
                    }
                  }}
                />
                {errors.lastName && (
                  <div
                    style={{
                      color: "#ff9999",
                      fontSize: isMobile ? 12 : 13,
                      marginTop: 4,
                    }}
                  >
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: isMobile ? 13 : 14,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Email Address *
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: isMobile ? "0.7rem 0.9rem" : "0.8rem 1rem",
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${
                    errors.email ? "#ff9999" : "rgba(255,255,255,0.2)"
                  }`,
                  borderRadius: 14,
                  color: "white",
                  outline: "none",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                    e.target.style.background = "rgba(255, 255, 255, 0.12)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  }
                }}
              />
              {errors.email && (
                <div
                  style={{
                    color: "#ff9999",
                    fontSize: isMobile ? 12 : 13,
                    marginTop: 4,
                  }}
                >
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: isMobile ? 13 : 14,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Phone Number *
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: isMobile ? "0.7rem 0.9rem" : "0.8rem 1rem",
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${
                    errors.phone ? "#ff9999" : "rgba(255,255,255,0.2)"
                  }`,
                  borderRadius: 14,
                  color: "white",
                  outline: "none",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  if (!errors.phone) {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                    e.target.style.background = "rgba(255, 255, 255, 0.12)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.phone) {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  }
                }}
              />
              {errors.phone && (
                <div
                  style={{
                    color: "#ff9999",
                    fontSize: isMobile ? 12 : 13,
                    marginTop: 4,
                  }}
                >
                  {errors.phone}
                </div>
              )}
            </div>

            <div>
              <label
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: isMobile ? 13 : 14,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Password *
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: isMobile ? "0.7rem 0.9rem" : "0.8rem 1rem",
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${
                    errors.password ? "#ff9999" : "rgba(255,255,255,0.2)"
                  }`,
                  borderRadius: 14,
                  color: "white",
                  outline: "none",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                    e.target.style.background = "rgba(255, 255, 255, 0.12)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  }
                }}
              />
              {errors.password && (
                <div
                  style={{
                    color: "#ff9999",
                    fontSize: isMobile ? 12 : 13,
                    marginTop: 4,
                  }}
                >
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <label
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: isMobile ? 13 : 14,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Confirm Password *
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: isMobile ? "0.7rem 0.9rem" : "0.8rem 1rem",
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${
                    errors.confirmPassword ? "#ff9999" : "rgba(255,255,255,0.2)"
                  }`,
                  borderRadius: 14,
                  color: "white",
                  outline: "none",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  if (!errors.confirmPassword) {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                    e.target.style.background = "rgba(255, 255, 255, 0.12)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.confirmPassword) {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  }
                }}
              />
              {errors.confirmPassword && (
                <div
                  style={{
                    color: "#ff9999",
                    fontSize: isMobile ? 12 : 13,
                    marginTop: 4,
                  }}
                >
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0",
                marginBottom: "0",
              }}
            >
              <label className="container">
                <input
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                />
                <div className="checkmark"></div>
              </label>
              <span
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: isMobile ? "0.85rem" : "0.9rem",
                  lineHeight: 1.4,
                }}
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity =
                      "0.8";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                  }}
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity =
                      "0.8";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                  }}
                >
                  Privacy Policy
                </Link>{" "}
                *
              </span>
            </div>
            {errors.acceptTerms && (
              <div
                style={{
                  color: "#ff9999",
                  fontSize: isMobile ? 12 : 13,
                  marginTop: 4,
                }}
              >
                Please accept terms
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: isMobile ? "0.9rem" : "1rem",
              background: isLoading
                ? "rgba(255,255,255,0.05)"
                : "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 14,
              color: isLoading ? "rgba(255,255,255,0.5)" : "white",
              fontSize: isMobile ? "0.95rem" : "1rem",
              fontWeight: 500,
              cursor: isLoading ? "not-allowed" : "pointer",
              marginTop: isMobile ? 16 : 18,
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(0, 0, 0, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {isLoading
              ? "Creating account..."
              : alreadyLogged
              ? "You are logged in"
              : "Create account"}
          </button>

          <div style={{ textAlign: "center", marginTop: isMobile ? 16 : 18 }}>
            <Link
              href="/"
              style={{
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                fontSize: isMobile ? "0.8rem" : "0.85rem",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.5)";
              }}
            >
              ← Back to IVU Wheels
            </Link>
          </div>
        </form>
      </div>

      {/* Footer */}
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
