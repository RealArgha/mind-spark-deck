
import { useEffect, useCallback, useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";

export type GenerationType = "flashcards" | "quiz";

interface UseDailyGenerationLimitReturn {
  canGenerate: (type: GenerationType) => boolean;
  remaining: (type: GenerationType) => number;
  recordGeneration: (type: GenerationType) => void;
  maxPerDay: number;
  maxPerSession: number;
  unlimited: boolean;
}

export function useDailyGenerationLimit(): UseDailyGenerationLimitReturn {
  const { subscribed, trial_active } = useSubscription();
  const unlimited = subscribed || trial_active;
  const maxPerSession = 5;
  const maxPerDay = 2; // number of sessions (total items/day = 10)

  // Return how many full generations are left today for the type
  const getKey = (type: GenerationType) =>
    `aiGenUsed_${type}_${new Date().toISOString().slice(0, 10)}`;

  const [counts, setCounts] = useState<{ [K in GenerationType]: number }>({
    flashcards: 0,
    quiz: 0,
  });

  useEffect(() => {
    if (unlimited) {
      setCounts({ flashcards: Infinity, quiz: Infinity });
    } else {
      setCounts({
        flashcards: Math.max(
          0,
          maxPerDay -
            parseInt(localStorage.getItem(getKey("flashcards")) || "0", 10)
        ),
        quiz: Math.max(
          0,
          maxPerDay - parseInt(localStorage.getItem(getKey("quiz")) || "0", 10)
        ),
      });
    }
    // eslint-disable-next-line
  }, [subscribed, trial_active]);

  const canGenerate = useCallback(
    (type: GenerationType) => {
      if (unlimited) return true;
      return counts[type] > 0;
    },
    [counts, unlimited]
  );

  const remaining = useCallback(
    (type: GenerationType) => (unlimited ? Infinity : counts[type]),
    [counts, unlimited]
  );

  const recordGeneration = (type: GenerationType) => {
    if (unlimited) return;
    const key = getKey(type);
    const used = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, used.toString());
    setCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, maxPerDay - used),
    }));
  };

  return { canGenerate, remaining, recordGeneration, maxPerDay, maxPerSession, unlimited };
}
