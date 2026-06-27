import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddCardDialog({ open, onOpenChange, onSave, mode, editData }) {
  const [type, setType] = useState(mode || "flashcard");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correct, setCorrect] = useState("A");

  useEffect(() => {
    if (editData) {
      setQuestion(editData.question || "");
      if (editData.answer !== undefined) {
        setType("flashcard");
        setAnswer(editData.answer || "");
      } else {
        setType("mcq");
        setOptA(editData.option_a || "");
        setOptB(editData.option_b || "");
        setOptC(editData.option_c || "");
        setOptD(editData.option_d || "");
        setCorrect(editData.correct_option || "A");
      }
    } else {
      setQuestion("");
      setAnswer("");
      setOptA("");
      setOptB("");
      setOptC("");
      setOptD("");
      setCorrect("A");
      if (mode) setType(mode);
    }
  }, [editData, mode, open]);

  const handleSave = () => {
    if (!question.trim()) return;
    if (type === "flashcard") {
      if (!answer.trim()) return;
      onSave({ type: "flashcard", question, answer, id: editData?.id });
    } else {
      if (!optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) return;
      onSave({ type: "mcq", question, option_a: optA, option_b: optB, option_c: optC, option_d: optD, correct_option: correct, id: editData?.id });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Add"} {type === "flashcard" ? "Flashcard" : "MCQ"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!editData && !mode && (
            <div className="flex gap-2">
              <Button
                variant={type === "flashcard" ? "default" : "outline"}
                onClick={() => setType("flashcard")}
                className="flex-1 rounded-xl"
              >
                Flashcard
              </Button>
              <Button
                variant={type === "mcq" ? "default" : "outline"}
                onClick={() => setType("mcq")}
                className="flex-1 rounded-xl"
              >
                MCQ
              </Button>
            </div>
          )}

          <div>
            <Label>Question</Label>
            <Textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter your question..." className="rounded-xl mt-1" />
          </div>

          {type === "flashcard" ? (
            <div>
              <Label>Answer</Label>
              <Textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Enter the answer..." className="rounded-xl mt-1" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Option A</Label>
                  <Input value={optA} onChange={e => setOptA(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Option B</Label>
                  <Input value={optB} onChange={e => setOptB(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Option C</Label>
                  <Input value={optC} onChange={e => setOptC(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Option D</Label>
                  <Input value={optD} onChange={e => setOptD(e.target.value)} className="rounded-xl mt-1" />
                </div>
              </div>
              <div>
                <Label>Correct Answer</Label>
                <Select value={correct} onValueChange={setCorrect}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button onClick={handleSave} className="w-full rounded-xl h-11">
            {editData ? "Update" : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}