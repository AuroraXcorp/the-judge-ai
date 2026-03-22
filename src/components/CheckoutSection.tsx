import { Check, Zap, FileText, MessageSquare, Shield } from "lucide-react";

const FEATURES = [
  { icon: Zap, text: "Unrestricted AI — no content filters for legal work" },
  { icon: MessageSquare, text: "Simulate debates and cross-examinations" },
  { icon: FileText, text: "Generate legal documents instantly" },
  { icon: Shield, text: "Jurisdiction-aware analysis for 190+ countries" },
];

const PLANS = [
  {
    name: "Monthly",
    price: "$49",
    period: "/mo",
    popular: false,
    features: ["Unlimited AI consultations", "Document generation", "Debate simulation", "10 jurisdictions"],
  },
  {
    name: "Annual",
    price: "$29",
    period: "/mo",
    popular: true,
    badge: "Save 40%",
    features: ["Everything in Monthly", "All 190+ jurisdictions", "Priority responses", "Early access to new features"],
  },
  {
    name: "Firm",
    price: "$99",
    period: "/mo",
    popular: false,
    features: ["Up to 10 seats", "Team collaboration", "Custom templates", "Dedicated support"],
  },
];

const CheckoutSection = () => {
  return (
    <section id="checkout" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Your AI Legal <span className="gold-text">Advantage</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Stop spending hours on research. Get instant, jurisdiction-specific legal analysis.
          </p>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-4 text-center space-y-2"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <feat.icon className="w-6 h-6 text-primary mx-auto" />
              <p className="text-xs text-secondary-foreground font-body">{feat.text}</p>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card rounded-2xl p-6 flex flex-col relative ${
                plan.popular ? "ring-2 ring-primary glow-gold" : ""
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full font-body">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-display font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground font-body">{plan.price}</span>
                  <span className="text-muted-foreground text-sm font-body">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-secondary-foreground font-body">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl text-sm font-semibold font-body transition-all ${
                  plan.popular
                    ? "gold-gradient text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-12 text-center text-xs text-muted-foreground font-body flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> 256-bit encryption
          </span>
          <span>•</span>
          <span>Cancel anytime</span>
          <span>•</span>
          <span>30-day money-back guarantee</span>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSection;
