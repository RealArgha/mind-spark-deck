
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AIGenerationButtonsProps {
  isProcessing: boolean;
  unlimited: boolean;
  canGenerate: (type: "flashcards" | "quiz") => boolean;
  remaining: (type: "flashcards" | "quiz") => number;
  maxPerDay: number;
  maxPerSession: number;
  generateWithAI: (type: "flashcards" | "quiz") => void;
}

const AIGenerationButtons: React.FC<AIGenerationButtonsProps> = ({
  isProcessing,
  unlimited,
  canGenerate,
  remaining,
  maxPerDay,
  maxPerSession,
  generateWithAI,
}) => (
  <>
    <div className="grid grid-cols-2 gap-2 mb-2">
      <Button 
        onClick={() => generateWithAI('flashcards')}
        disabled={isProcessing || (!unlimited && !canGenerate("flashcards"))}
        className="bg-gradient-to-r from-purple-600 to-pink-600"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isProcessing ? "Generating..." : "AI Flashcards"}
      </Button>
      <Button 
        onClick={() => generateWithAI('quiz')}
        disabled={isProcessing || (!unlimited && !canGenerate("quiz"))}
        variant="outline"
        className="border-purple-300 text-purple-700 hover:bg-purple-50"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isProcessing ? "Generating..." : "AI Quiz"}
      </Button>
    </div>
    {(!unlimited) && (
      <div className="text-xs text-muted-foreground mb-2 text-right">
        <div>
          {`Flashcards generations left: `}
          <span className="font-medium text-primary">{remaining("flashcards")} / {maxPerDay} sessions</span>
          <span className="ml-1 text-[11px]">(5 cards/session, up to 10/day)</span>
        </div>
        <div>
          {`Quiz generations left: `}
          <span className="font-medium text-primary">{remaining("quiz")} / {maxPerDay} sessions</span>
          <span className="ml-1 text-[11px]">(5 questions/session, up to 10/day)</span>
        </div>
      </div>
    )}
  </>
);

export default AIGenerationButtons;
