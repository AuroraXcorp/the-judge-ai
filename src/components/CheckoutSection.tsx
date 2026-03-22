import { Check, Zap, FileText, MessageSquare, Shield } from "lucide-react";
import { useState } from "react";

const FEATURES = [
  { icon: Zap, text: "Unrestricted AI — no content filters for legal work" },
  { icon: MessageSquare, text: "Simulate debates and cross-examinations" },
  { icon: FileText, text: "Generate legal documents instantly" },
  { icon: Shield, text: "Jurisdiction-aware analysis for 190+ countries" },
];

const PLANS = [
  {
    id: "weekly",
    name: "1-Week Trial",
    price: "$4.99",
    originalPrice: null,
    discount: null,
    dailyPrice: "$0.71",
    tagline: "☕ Less than a coffee a day",
    popular: false,
    features: null,
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: "$9.99",
    originalPrice: "$39.99",
    discount: "75% OFF",
    dailyPrice: "$0.33",
    tagline: "⚖️ Less than a court filing fee",
    popular: true,
    features: ["Accelerate your cases", "AI Lawyer 24/7", "Document Generator", "Debate Simulation"],
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    price: "$19.99",
    originalPrice: "$89.99",
    discount: "78% OFF",
    dailyPrice: "$0.22",
    tagline: "📋 Less than a single legal consultation",
    popular: false,
    features: null,
  },
];

const CheckoutSection = () => {
  const [selected, setSelected] = useState("monthly");

  return (
    <section id="checkout" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-display text-foreground tracking-wide">
            YOUR AI LEGAL <span className="red-text">ADVANTAGE</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-body">
            Stop spending hours on research. Get instant, jurisdiction-specific legal analysis.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          {FEATURES.map((feat, i) => (
            <div key={i} className="glass-card rounded-xl p-3 md:p-4 text-center space-y-2">
              <feat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto" />
              <p className="text-[10px] md:text-xs text-secondary-foreground font-body">{feat.text}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 md:space-y-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`relative glass-card rounded-2xl cursor-pointer transition-all ${
                plan.popular ? "ring-2 ring-primary glow-red" : ""
              } ${selected === plan.id ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <div className="red-gradient text-primary-foreground text-xs font-bold font-display tracking-widest text-center py-1.5 rounded-t-2xl">
                  MOST POPULAR
                </div>
              )}

              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selected === plan.id ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {selected === plan.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base md:text-lg font-bold text-foreground font-body">{plan.name}</span>
                        {plan.discount && (
                          <span className="text-[10px] md:text-xs font-semibold font-body bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                            {plan.discount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {plan.originalPrice && (
                          <span className="text-xs md:text-sm text-muted-foreground font-body line-through">{plan.originalPrice}</span>
                        )}
                        <span className="text-xs md:text-sm text-muted-foreground font-body">{plan.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl md:text-3xl font-bold text-foreground font-body">{plan.dailyPrice}</span>
                    <span className="text-xs md:text-sm text-muted-foreground font-body ml-1">/ day</span>
                  </div>
                </div>

                <div className="border-t border-border mt-3 md:mt-4 pt-3">
                  <p className="text-center text-xs md:text-sm text-muted-foreground font-body">{plan.tagline}</p>
                </div>

                {plan.features && (
                  <div className="border-t border-border mt-3 pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      {plan.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs md:text-sm text-secondary-foreground font-body">
                          <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 md:mt-8 red-gradient text-primary-foreground py-3.5 md:py-4 rounded-2xl text-base md:text-lg font-semibold font-body hover:opacity-90 transition-opacity">
          Get Started Now
        </button>

        <div className="mt-4 md:mt-6 text-center text-[10px] md:text-xs text-muted-foreground font-body flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 256-bit encryption</span>
          <span>•</span><span>Cancel anytime</span><span>•</span><span>30-day money-back guarantee</span>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSection;
