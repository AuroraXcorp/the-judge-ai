import { useRef } from "react";
import { Scale } from "lucide-react";
import DemoChat from "@/components/DemoChat";
import CheckoutSection from "@/components/CheckoutSection";

const Index = () => {
  const checkoutRef = useRef<HTMLDivElement>(null);

  const scrollToCheckout = () => {
    const el = document.getElementById("plans-anchor");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[400px] md:h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-5">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          <span className="text-lg md:text-xl font-display text-foreground">THE JUDGE AI</span>
        </div>
        <button
          onClick={scrollToCheckout}
          className="red-gradient text-primary-foreground px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-semibold font-body hover:opacity-90 transition-opacity"
        >
          Get Access
        </button>
      </nav>

      {/* Hero + Demo combined */}
      <section className="relative z-10 pt-16 sm:pt-20 md:pt-28 pb-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10 md:space-y-14">
          {/* Hero text */}
          <div className="text-center space-y-4 md:space-y-6 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display text-foreground leading-none tracking-wide">
              YOUR UNRESTRICTED
              <br />
              <span className="red-text">LEGAL AI</span> PARTNER
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-body leading-relaxed">
              Simulate debates, generate documents, and get instant legal analysis — 
              built for lawyers who demand more from AI.
            </p>
          </div>

          {/* Demo — clean open input */}
          <DemoChat onUnlock={scrollToCheckout} />
        </div>
      </section>

      {/* Checkout */}
      <div ref={checkoutRef}>
        <CheckoutSection />
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 md:py-8 px-4 sm:px-6 text-center">
        <p className="text-xs text-muted-foreground font-body">
          © 2026 The Judge AI. All rights reserved. This is an AI tool and does not constitute legal advice.
        </p>
      </footer>
    </div>
  );
};

export default Index;
