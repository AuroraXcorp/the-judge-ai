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
  "Based on the applicable statutes and case law, I would argue that the defendant's liability is clearly established under the doctrine of negligence. The key elements — duty of care, breach, causation, and damages — are all present in this scenario.",
  "Under the relevant jurisdiction's civil code, the statute of limitations for this type of claim is typically 3 years from the date of discovery. However, there are exceptions that could extend this period, particularly in cases involving fraud or concealment.",
  "I recommend we approach this from a contractual breach standpoint. The evidence suggests a clear violation of the implied covenant of good faith and fair dealing, which strengthens our position significantly.",
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
      const shouldBlur = newCount > 1;
      const aiMsg: Message = {
        role: "ai",
        text: AI_RESPONSES[responseCount % AI_RESPONSES.length],
        blurred: shouldBlur,
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
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${
                msg.role === "user"
                  ? "red-gradient text-primary-foreground"
                  : "bg-card border border-border text-card-foreground"
              } ${msg.blurred ? "chat-blur" : ""}`}>
                {msg.text}
              </div>
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
