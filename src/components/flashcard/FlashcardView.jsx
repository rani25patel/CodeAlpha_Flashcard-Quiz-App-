import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FlashcardView({ cards, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [studied, setStudied] = useState(new Set());

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
        <div className="text-5xl">📚</div>
        <p className="text-sm">No flashcards yet. Add some to get started!</p>
      </div>
    );
  }

  const card = cards[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / cards.length) * 100);

  const goNext = () => {
    setStudied(s => new Set(s).add(currentIndex));
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setFlipped(false);
      setCurrentIndex(i => i + 1);
    } else if (onComplete) {
      onComplete(cards.length);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setFlipped(false);
      setCurrentIndex(i => i - 1);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mx-auto">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="font-bold text-primary">{progressPct}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex gap-1.5 justify-center pt-1">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-6 bg-primary" : studied.has(i) ? "w-1.5 bg-primary/40" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="w-full aspect-[4/3] [perspective:1000px] cursor-pointer select-none"
        onClick={() => setFlipped(!flipped)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ x: direction * 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 120, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front - Question */}
              <div
                className="absolute inset-0 [backface-visibility:hidden] rounded-3xl bg-white border border-slate-200 shadow-lg flex flex-col overflow-hidden"
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <Eye size={11} /> Question
                  </div>
                  {studied.has(currentIndex) && (
                    <div className="absolute top-4 right-4 text-emerald-500">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                  <div className="text-4xl mb-4">🤔</div>
                  <p className="text-lg font-bold leading-relaxed text-slate-800 px-2">{card.question}</p>
                </div>
                <div className="pb-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Eye size={13} />
                  Tap card to reveal answer
                </div>
              </div>

              {/* Back - Answer */}
              <div
                className="absolute inset-0 [backface-visibility:hidden] rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-lg flex flex-col overflow-hidden [transform:rotateY(180deg)]"
              >
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 size={11} /> Answer
                  </div>
                  <div className="text-4xl mb-4">💡</div>
                  <p className="text-lg font-bold leading-relaxed text-emerald-800 px-2">{card.answer}</p>
                </div>
                <div className="pb-4 flex items-center justify-center gap-1.5 text-xs text-emerald-600">
                  <RotateCcw size={13} />
                  Tap card to flip back
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 w-full">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="rounded-2xl h-12 w-12 p-0 shrink-0"
        >
          <ChevronLeft size={20} />
        </Button>

        <Button
          onClick={() => setFlipped(!flipped)}
          variant="secondary"
          className="flex-1 rounded-2xl h-12 font-semibold"
        >
          <Eye size={18} className="mr-2" />
          {flipped ? "Hide Answer" : "Show Answer"}
        </Button>

        <Button
          onClick={goNext}
          className="rounded-2xl h-12 w-12 p-0 shrink-0"
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {currentIndex === cards.length - 1
          ? "You're on the last card — tap Next to finish"
          : "Swipe through cards to study"}
      </p>
    </div>
  );
}