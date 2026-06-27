import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, BookOpen, TrendingUp, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import moment from "moment";

export default function ProgressReport() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [f, p] = await Promise.all([
        base44.entities.Folder.list(),
        base44.entities.Progress.list(),
      ]);
      setFolders(f);
      setProgress(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalStudied = progress.reduce((sum, p) => sum + (p.cards_studied || 0), 0);
  const totalCorrect = progress.reduce((sum, p) => sum + (p.mcq_correct || 0), 0);
  const totalMcq = progress.reduce((sum, p) => sum + (p.mcq_total || 0), 0);
  const overallPct = totalMcq > 0 ? Math.round((totalCorrect / totalMcq) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="font-bold text-lg">Progress Report</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground"
        >
          <h2 className="text-sm font-medium opacity-80 mb-4">Overall Performance</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <BookOpen size={20} className="mx-auto mb-1 opacity-80" />
              <p className="text-2xl font-bold">{totalStudied}</p>
              <p className="text-xs opacity-70">Cards Studied</p>
            </div>
            <div className="text-center">
              <TrendingUp size={20} className="mx-auto mb-1 opacity-80" />
              <p className="text-2xl font-bold">{overallPct}%</p>
              <p className="text-xs opacity-70">MCQ Accuracy</p>
            </div>
            <div className="text-center">
              <Award size={20} className="mx-auto mb-1 opacity-80" />
              <p className="text-2xl font-bold">{totalCorrect}/{totalMcq}</p>
              <p className="text-xs opacity-70">Correct Answers</p>
            </div>
          </div>
        </motion.div>

        {/* Per-folder */}
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          By Quiz Folder
        </h3>

        <div className="space-y-3">
          {folders.map((folder, i) => {
            const p = progress.find(x => x.folder_id === folder.id);
            const pct = p?.mcq_total > 0 ? Math.round((p.mcq_correct / p.mcq_total) * 100) : 0;

            return (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{folder.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{folder.title}</h4>
                    {p?.last_studied && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={10} />
                        Last studied {moment(p.last_studied).fromNow()}
                      </p>
                    )}
                  </div>
                  <span className="text-lg font-bold text-primary">{pct}%</span>
                </div>
                <div className="bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{p?.cards_studied || 0} cards studied</span>
                  <span>{p?.mcq_correct || 0}/{p?.mcq_total || 0} MCQ correct</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {progress.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Award size={40} className="mx-auto mb-3 opacity-30" />
            <p>No study progress yet. Start studying to see your report!</p>
          </div>
        )}
      </div>
    </div>
  );
}