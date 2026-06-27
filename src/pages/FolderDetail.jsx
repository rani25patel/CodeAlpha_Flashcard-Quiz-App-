import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, BookOpen, ListChecks, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FlashcardView from "@/components/flashcard/FlashcardView";
import MCQView from "@/components/flashcard/MCQView";
import AddCardDialog from "@/components/flashcard/AddCardDialog";
import { motion } from "framer-motion";

export default function FolderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [mcqs, setMcqs] = useState([]);
  const [tab, setTab] = useState("flashcards");
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState(null);
  const [addMode, setAddMode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFolder();
  }, [id]);

  const loadFolder = async () => {
    try {
      const [f, fc, mq] = await Promise.all([
        base44.entities.Folder.get(id),
        base44.entities.Flashcard.filter({ folder_id: id }),
        base44.entities.MCQ.filter({ folder_id: id }),
      ]);
      setFolder(f);
      setFlashcards(fc);
      setMcqs(mq);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    if (data.type === "flashcard") {
      if (data.id) {
        const updated = await base44.entities.Flashcard.update(data.id, {
          question: data.question,
          answer: data.answer,
        });
        setFlashcards(fc => fc.map(c => c.id === data.id ? updated : c));
      } else {
        const created = await base44.entities.Flashcard.create({
          folder_id: id,
          question: data.question,
          answer: data.answer,
        });
        setFlashcards(fc => [...fc, created]);
      }
    } else {
      if (data.id) {
        const updated = await base44.entities.MCQ.update(data.id, {
          question: data.question,
          option_a: data.option_a,
          option_b: data.option_b,
          option_c: data.option_c,
          option_d: data.option_d,
          correct_option: data.correct_option,
        });
        setMcqs(m => m.map(q => q.id === data.id ? updated : q));
      } else {
        const created = await base44.entities.MCQ.create({
          folder_id: id,
          question: data.question,
          option_a: data.option_a,
          option_b: data.option_b,
          option_c: data.option_c,
          option_d: data.option_d,
          correct_option: data.correct_option,
        });
        setMcqs(m => [...m, created]);
      }
    }
    setEditData(null);
  };

  const handleDeleteFlashcard = async (cardId) => {
    await base44.entities.Flashcard.delete(cardId);
    setFlashcards(fc => fc.filter(c => c.id !== cardId));
  };

  const handleDeleteMcq = async (mcqId) => {
    await base44.entities.MCQ.delete(mcqId);
    setMcqs(m => m.filter(q => q.id !== mcqId));
  };

  const handleFlashcardComplete = async (count) => {
    const existing = await base44.entities.Progress.filter({ folder_id: id });
    if (existing.length > 0) {
      await base44.entities.Progress.update(existing[0].id, {
        cards_studied: (existing[0].cards_studied || 0) + count,
        last_studied: new Date().toISOString(),
      });
    } else {
      await base44.entities.Progress.create({
        folder_id: id,
        cards_studied: count,
        last_studied: new Date().toISOString(),
      });
    }
  };

  const handleMcqComplete = async (correct, total) => {
    const existing = await base44.entities.Progress.filter({ folder_id: id });
    if (existing.length > 0) {
      await base44.entities.Progress.update(existing[0].id, {
        mcq_correct: (existing[0].mcq_correct || 0) + correct,
        mcq_total: (existing[0].mcq_total || 0) + total,
        last_studied: new Date().toISOString(),
      });
    } else {
      await base44.entities.Progress.create({
        folder_id: id,
        mcq_correct: correct,
        mcq_total: total,
        last_studied: new Date().toISOString(),
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Folder not found</p>
        <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl">Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg flex items-center gap-2">
              <span>{folder.icon}</span> {folder.title}
            </h1>
          </div>
          <Button
            size="sm"
            className="rounded-xl"
            onClick={() => { setAddMode(tab === "flashcards" ? "flashcard" : "mcq"); setEditData(null); setShowAdd(true); }}
          >
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full rounded-xl bg-muted/50 p-1">
            <TabsTrigger value="flashcards" className="flex-1 rounded-lg text-sm gap-1.5">
              <BookOpen size={14} /> Flashcards ({flashcards.length})
            </TabsTrigger>
            <TabsTrigger value="mcq" className="flex-1 rounded-lg text-sm gap-1.5">
              <ListChecks size={14} /> MCQs ({mcqs.length})
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex-1 rounded-lg text-sm gap-1.5">
              <Edit2 size={14} /> Manage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flashcards" className="mt-6">
            <FlashcardView cards={flashcards} onComplete={handleFlashcardComplete} />
          </TabsContent>

          <TabsContent value="mcq" className="mt-6">
            <MCQView questions={mcqs} onComplete={handleMcqComplete} />
          </TabsContent>

          <TabsContent value="manage" className="mt-6 space-y-6">
            {/* Flashcard List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Flashcards</h3>
                <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={() => { setAddMode("flashcard"); setEditData(null); setShowAdd(true); }}>
                  <Plus size={12} className="mr-1" /> Add
                </Button>
              </div>
              {flashcards.length === 0 && <p className="text-sm text-muted-foreground">No flashcards yet</p>}
              <div className="space-y-2">
                {flashcards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white border rounded-xl p-3 flex items-start justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{card.question}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{card.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => { setEditData(card); setAddMode("flashcard"); setShowAdd(true); }}
                      >
                        <Edit2 size={12} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-lg text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteFlashcard(card.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* MCQ List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">MCQs</h3>
                <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={() => { setAddMode("mcq"); setEditData(null); setShowAdd(true); }}>
                  <Plus size={12} className="mr-1" /> Add
                </Button>
              </div>
              {mcqs.length === 0 && <p className="text-sm text-muted-foreground">No MCQs yet</p>}
              <div className="space-y-2">
                {mcqs.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white border rounded-xl p-3 flex items-start justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{q.question}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Correct: {q.correct_option}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => { setEditData(q); setAddMode("mcq"); setShowAdd(true); }}
                      >
                        <Edit2 size={12} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-lg text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteMcq(q.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddCardDialog
        open={showAdd}
        onOpenChange={setShowAdd}
        onSave={handleSave}
        mode={addMode}
        editData={editData}
      />
    </div>
  );
}
