import { useState, useRef, useEffect } from "react";
import { ChevronDown, Send, Lock, Globe } from "lucide-react";

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
];

interface Message {
  role: "user" | "ai";
  text: string;
  blurred?: boolean;
}

const AI_RESPONSES = [
  "Based on the applicable statutes and case law in your jurisdiction, the defendant's liability appears to be clearly established under the doctrine of negligence. The key elements — duty of care, breach, causation, and damages — are all present in this scenario. Furthermore, recent precedents from appellate courts have reinforced the standard of reasonable care applicable here, which significantly strengthens the plaintiff's position. I would recommend focusing on the following strategy: first, establish the timeline of events to demonstrate a clear causal link between the defendant's actions and the resulting harm. Second, gather expert testimony to quantify the economic and non-economic damages sustained. Third, consider filing a motion for summary judgment given the strength of the evidence, as the opposing party may struggle to raise a genuine dispute of material fact. Additionally, under the comparative negligence framework adopted by most modern jurisdictions, even if the plaintiff bears some degree of fault, recovery is still possible provided their share of responsibility does not exceed the statutory threshold.",
  "Under the relevant jurisdiction's civil code, the statute of limitations for this type of claim is typically 3 years from the date of discovery. However, there are several critical exceptions that could extend or toll this period. In cases involving fraud, concealment, or fiduciary breach, courts have consistently applied the discovery rule more liberally, sometimes extending the effective filing window by several years. I would advise conducting a thorough review of all correspondence and transactional records to pinpoint the earliest date on which the injured party knew or should have known about the claim. Moreover, if the defendant engaged in active concealment of material facts, you may also have grounds to argue for equitable tolling. From a procedural standpoint, it would be prudent to file a protective action before the primary limitations period expires, while simultaneously pursuing alternative dispute resolution channels.",
  "I recommend approaching this matter from a contractual breach standpoint. The evidence strongly suggests a clear violation of the implied covenant of good faith and fair dealing, which is recognized in virtually all common law jurisdictions. This covenant requires that both parties act honestly and not deprive the other of expected benefits. In analyzing the specific facts, there appear to be multiple instances where the breaching party acted inconsistently with reasonable expectations established at contract formation. To build the strongest case, I would suggest organizing evidence chronologically and categorizing each breach by severity and financial impact. Expert economic analysis will be essential to quantify direct damages and consequential losses, including lost profits. Depending on the jurisdiction, you may also seek punitive damages if the breach was willful or in bad faith.",
];

interface DemoChatProps {
  onUnlock: () => void;
}

const DemoChat = ({ onUnlock }: DemoChatProps) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasTriedDemo, setHasTriedDemo] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const countryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const newCount = responseCount + 1;
      const aiMsg: Message = {
        role: "ai",
        text: AI_RESPONSES[responseCount % AI_RESPONSES.length],
        blurred: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setResponseCount(newCount);
      setIsTyping(false);
      if (!hasTriedDemo) setHasTriedDemo(true);
    }, 3000);
  };

  const showUnlock = hasTriedDemo && responseCount > 1;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Top row: input bar + country selector side by side */}
      <div className="flex items-center gap-3">
        {/* Input bar */}
        <div className="flex-1 bg-card/60 backdrop-blur-xl border border-border rounded-2xl px-4 md:px-5 py-3 flex items-center gap-3 shadow-lg shadow-primary/5 transition-all focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask any legal question..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm md:text-base font-body outline-none min-w-0"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="shrink-0 red-gradient text-primary-foreground p-2 md:p-2.5 rounded-xl disabled:opacity-30 hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Country selector — outside the input */}
        <div ref={countryRef} className="relative shrink-0">
          <button
            onClick={() => setCountryOpen(!countryOpen)}
            className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border hover:border-primary/30 text-secondary-foreground text-sm transition-colors font-body"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="hidden sm:inline text-xs text-muted-foreground">{selectedCountry.code}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {countryOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 py-1 max-h-60 overflow-y-auto">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => { setSelectedCountry(country); setCountryOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-secondary transition-colors font-body"
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Jurisdiction hint */}
      {messages.length === 0 && (
        <div className="flex items-center justify-center gap-2 opacity-50">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-body">
            Jurisdiction: {selectedCountry.name}
          </span>
        </div>
      )}

      {/* Chat messages — grow downward */}
      {messages.length > 0 && (
        <div className="space-y-3 px-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
              {msg.role === "user" ? (
                <div className="max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed red-gradient text-primary-foreground">
                  {msg.text}
                </div>
              ) : (
                <div className="max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed bg-card border border-border text-card-foreground">
                  <span>{msg.text.slice(0, 120)}</span>
                  <span className="chat-blur inline">{msg.text.slice(120)}</span>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Unlock CTA */}
      {showUnlock && (
        <div className="relative animate-fade-in-up">
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-foreground font-body">Full analysis locked</p>
                <p className="text-xs text-muted-foreground font-body">Unlock unlimited AI legal insights</p>
              </div>
            </div>
            <button onClick={onUnlock} className="red-gradient text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold font-body hover:opacity-90 transition-opacity w-full sm:w-auto">
              Unlock Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoChat;
