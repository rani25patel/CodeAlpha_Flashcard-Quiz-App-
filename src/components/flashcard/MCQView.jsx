import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MCQView({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>No MCQs yet. Add some to get started!</p>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 gap-4"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
          pct >= 70 ? "bg-emerald-100 text-emerald-600" : pct >= 40 ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
        }`}>
          <Trophy size={40} />
        </div>
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <p className="text-4xl font-bold text-primary">{pct}%</p>
        <p className="text-muted-foreground">{score} out of {questions.length} correct</p>
        <Button onClick={() => { setCurrentIndex(0); setScore(0); setFinished(false); setSelected(null); setShowResult(false); }} className="mt-4 rounded-xl">
          Try Again
        </Button>
      </motion.div>
    );
  }

  const q = questions[currentIndex];
  const options = [
    { key: "A", text: q.option_a },
    { key: "B", text: q.option_b },
    { key: "C", text: q.option_c },
    { key: "D", text: q.option_d },
  ];

  const handleSelect = (key) => {
    if (showResult) return;
    setSelected(key);
    setShowResult(true);
    if (key === q.correct_option) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      if (onComplete) onComplete(score + (selected === q.correct_option ? 1 : 0), questions.length);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Question {currentIndex + 1}/{questions.length}</span>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
          Score: {score}
        </span>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10">
        <p className="text-lg font-semibold leading-relaxed">{q.question}</p>
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="wait">
          {options.map((opt, i) => {
            let optionStyle = "bg-white border-2 border-muted hover:border-primary/40 hover:bg-primary/5";
            if (showResult) {
              if (opt.key === q.correct_option) {
                optionStyle = "bg-emerald-50 border-2 border-emerald-400 text-emerald-800";
              } else if (opt.key === selected && opt.key !== q.correct_option) {
                optionStyle = "bg-red-50 border-2 border-red-400 text-red-800";
              } else {
                optionStyle = "bg-muted/30 border-2 border-muted text-muted-foreground";
              }
            }

            return (
              <motion.button
                key={opt.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(opt.key)}
                disabled={showResult}
                className={`w-full text-left px-4 py-3.5 rounded-xl transition-all flex items-center gap-3 ${optionStyle}`}
              >
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                  {opt.key}
                </span>
                <span className="text-sm font-medium flex-1">{opt.text}</span>
                {showResult && opt.key === q.correct_option && <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />}
                {showResult && opt.key === selected && opt.key !== q.correct_option && <XCircle size={20} className="text-red-500 shrink-0" />}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {showResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button onClick={handleNext} className="w-full rounded-xl h-12">
            {currentIndex === questions.length - 1 ? "See Results" : "Next Question"}
            <ChevronRight size={18} className="ml-1" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
