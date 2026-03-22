import { useRef } from "react";
import { Scale } from "lucide-react";
import DemoChat from "@/components/DemoChat";
import CheckoutSection from "@/components/CheckoutSection";

const Index = () => {
  const checkoutRef = useRef<HTMLDivElement>(null);

  const scrollToCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 text-primary" />
          <span className="text-xl font-display text-foreground">THE JUDGE AI</span>
        </div>
        <button
          onClick={scrollToCheckout}
          className="red-gradient text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold font-body hover:opacity-90 transition-opacity"
        >
          Get Access
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-12 md:pt-20 pb-8 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-foreground leading-none tracking-wide">
            YOUR UNRESTRICTED
            <br />
            <span className="red-text">LEGAL AI</span> PARTNER
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-body leading-relaxed">
            Simulate debates, generate documents, and get instant legal analysis — 
            built for lawyers who demand more from AI.
          </p>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="relative z-10 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm text-muted-foreground font-body mb-6">
            Select your jurisdiction and ask any legal question
          </p>
          <DemoChat onUnlock={scrollToCheckout} />
        </div>
      </section>

      {/* Checkout */}
      <div ref={checkoutRef}>
        <CheckoutSection />
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6 text-center">
        <p className="text-xs text-muted-foreground font-body">
          © 2026 The Judge AI. All rights reserved. This is an AI tool and does not constitute legal advice.
        </p>
      </footer>
    </div>
  );
};

export default Index;
