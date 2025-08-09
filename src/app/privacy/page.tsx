import FooterSection from "../../components/FooterSection";
import SEOHead from "../../components/SEOHead";

export const metadata = {
  title: "Privacy Policy - IVU ",
  description:
    "Privacy Policy for IVU Wheels - Your privacy is important to us.",
};

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy - IVU Wheels"
        description="Privacy Policy for IVU Wheels - Your privacy is important to us."
        url="/privacy"
      />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d  100%)",
          color: "white",
          fontFamily: "Gruppo, Arial, sans-serif",
        }}
      >
        <nav
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(10px)",
            padding: "1rem 0",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <a
              href="/"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "white",
                textDecoration: "none",
              }}
            >
              IVU
            </a>
            <a
              href="/"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                padding: "0.5rem 1rem",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "20px",
                transition: "all 0.3s ease",
              }}
            >
              Back to Home
            </a>
          </div>
        </nav>

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "4rem 2rem",
            lineHeight: "1.6",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "3rem",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Privacy Policy
          </h1>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Information We Collect
            </h2>
            <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
              We collect information you provide directly to us, such as when
              you create an account, make a purchase, or contact us for support.
              This may include your name, email address, shipping address, and
              payment information.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              How We Use Your Information
            </h2>
            <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
              We use the information we collect to provide, maintain, and
              improve our services, process transactions, send you technical
              notices and support messages, and communicate with you about
              products, services, and promotional offers.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Information Sharing
            </h2>
            <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy. We may share your information with
              trusted service providers who assist us in operating our website
              and conducting our business.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Data Security
            </h2>
            <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Contact Us
            </h2>
            <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
              If you have any questions about this Privacy Policy, please
              contact us at privacy@ivu-wheels.com or through our contact form.
            </p>
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem", opacity: 0.7 }}>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <FooterSection />
      </div>
    </>
  );
}
