import { useState, useRef, useEffect } from "react";
import { ChevronDown, Send, Scale, Lock } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    }, 1500);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden glow-red max-w-2xl mx-auto">
      {/* Country Selector */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground font-display tracking-wider">THE JUDGE AI</span>
          <span className="text-xs text-muted-foreground font-body">• Demo</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setCountryOpen(!countryOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors font-body"
          >
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.name}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {countryOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
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

      {/* Chat */}
      <div className="h-80 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <Scale className="w-10 h-10 text-primary animate-float" />
            <p className="text-muted-foreground text-sm font-body">Ask any legal question to see The Judge AI in action</p>
            <p className="text-muted-foreground text-xs font-body">Jurisdiction: {selectedCountry.name}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${
              msg.role === "user" ? "red-gradient text-primary-foreground" : "bg-secondary text-secondary-foreground"
            } ${msg.blurred ? "chat-blur" : ""}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="bg-secondary rounded-2xl px-4 py-3">
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Unlock CTA */}
      {hasTriedDemo && responseCount > 1 && (
        <div className="relative">
          <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
          <div className="bg-card/95 backdrop-blur-sm border-t border-border px-5 py-4 flex items-center justify-between z-20 relative">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground font-body">Full analysis locked</p>
                <p className="text-xs text-muted-foreground font-body">Unlock unlimited AI legal insights</p>
              </div>
            </div>
            <button onClick={onUnlock} className="red-gradient text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold font-body hover:opacity-90 transition-opacity">
              Unlock Now
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border px-5 py-3 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a legal question..."
          className="flex-1 bg-secondary text-secondary-foreground placeholder:text-muted-foreground rounded-xl px-4 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-primary transition-all"
        />
        <button onClick={handleSend} disabled={!input.trim() || isTyping} className="red-gradient text-primary-foreground p-2.5 rounded-xl disabled:opacity-40 hover:opacity-90 transition-opacity">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DemoChat;
