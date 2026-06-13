import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function GeminiConfidenceBadge({
  confidence,
  fallback,
}: {
  confidence: number;
  fallback?: boolean;
}) {
  const pct = Math.round(confidence * 100);
  return (
    <Badge variant="outline" className="text-xs gap-1">
      <Sparkles className="h-3 w-3 text-primary" />
      {fallback ? "Fallback" : `AI Confidence ${pct}%`}
    </Badge>
  );
}
