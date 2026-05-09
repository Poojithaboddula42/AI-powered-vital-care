import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAiChat } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User as UserIcon, Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAssistant() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hello ${user?.name}! I'm your VitalCare AI Health Assistant. I can help answer questions about your vitals, explain medical terms, or provide general wellness tips. How can I help you today?` }
  ]);
  const chatMutation = useAiChat();

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = text.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    try {
      const res = await chatMutation.mutateAsync({
        data: { message: userMsg }
      });
      
      setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I couldn't connect to the medical knowledge base right now. Please try again later." }]);
    }
  };

  const suggestions = [
    "What is a normal resting heart rate?",
    "How can I lower my blood pressure?",
    "What does SpO2 mean?",
    "Tips for better sleep"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Health Assistant
        </h1>
        <p className="text-muted-foreground mt-1">Get instant answers about your health metrics and general wellness.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border shadow-sm">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 pb-4">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}>
                <div className={cn(
                  "h-10 w-10 shrink-0 rounded-full flex items-center justify-center border",
                  msg.role === "user" ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border"
                )}>
                  {msg.role === "user" ? <UserIcon className="h-5 w-5" /> : <Bot className="h-5 w-5 text-primary" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl shadow-sm text-sm sm:text-base whitespace-pre-wrap leading-relaxed",
                  msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/50 border rounded-tl-sm text-foreground"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex gap-4 max-w-[80%]">
                <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center border bg-muted text-foreground border-border">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 border rounded-tl-sm text-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 bg-background border-t">
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((suggestion, i) => (
              <Button 
                key={i} 
                variant="secondary" 
                size="sm" 
                className="text-xs rounded-full bg-secondary hover:bg-secondary/80"
                onClick={() => handleSend(suggestion)}
                disabled={chatMutation.isPending}
              >
                {suggestion}
              </Button>
            ))}
          </div>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your health..."
              className="flex-1 h-12 bg-muted/50 border-border focus-visible:ring-primary/20"
              disabled={chatMutation.isPending}
            />
            <Button type="submit" size="icon" className="h-12 w-12 shrink-0 rounded-full" disabled={!input.trim() || chatMutation.isPending}>
              <Send className="h-5 w-5 ml-0.5" />
            </Button>
          </form>
          <div className="text-center mt-3 text-[10px] text-muted-foreground uppercase tracking-widest">
            AI can make mistakes. Always consult a real doctor for medical advice.
          </div>
        </div>
      </Card>
    </div>
  );
}
