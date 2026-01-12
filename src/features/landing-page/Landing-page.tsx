import Header from "./components/desktop/Header";
import HeroSection from "./components/desktop/HeroSection";
import Stats from "./components/desktop/stats";
import DemoSection from "./components/desktop/DemoSection";
import Trust from "./components/desktop/Trust";
import Transparency from "./components/desktop/Transparency";
import Testimonials from "./components/desktop/Testimonials";
import Footer from "./components/desktop/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <Stats />
      <DemoSection />
      <Trust />
      <Transparency />
      <div className="py-50">
        <Testimonials />
      </div>
      <Footer />
      {/* Other sections will be added here */}
    </div>
  );
}
