import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: "2rem",
        color: "white",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "2rem",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "500px",
        }}
      >
        <h2
          style={{ marginBottom: "1rem", color: "white", fontSize: "1.5rem" }}
        >
          Page Not Found
        </h2>
        <p style={{ marginBottom: "2rem", color: "rgba(255, 255, 255, 0.8)" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "1rem",
            textDecoration: "none",
            transition: "all 0.3s ease",
            display: "inline-block",
          }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
