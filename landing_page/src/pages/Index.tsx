import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Audience from "@/components/landing/Audience";
import Features from "@/components/landing/Features";
import Difference from "@/components/landing/Difference";
import Security from "@/components/landing/Security";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main>
        <Hero />
        <Audience />
        <Features />
        <Difference />
        <Security />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
