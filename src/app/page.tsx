import Hero from "../components/Hero.jsx";
import CategorySection from "../components/CategorySection";
import StatsSection from "../components/StatsSection";
import FooterSection from "../components/FooterSection";

export default function Home() {
  return (
    <main style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
      <Hero />
      <StatsSection />
      <CategorySection />
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <FooterSection />
      </div>
    </main>
  );
}
