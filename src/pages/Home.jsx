import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Plus, BookOpen, Brain, TrendingUp, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import FolderCard from "@/components/flashcard/FolderCard";
import { motion } from "framer-motion";

const DEFAULT_FOLDERS = [
  { title: "Science", icon: "🔬", color: "blue", description: "General Science" },
  { title: "Maths", icon: "📐", color: "purple", description: "Mathematics" },
  { title: "Art", icon: "🎨", color: "pink", description: "Art & Culture" },
  { title: "History", icon: "📜", color: "orange", description: "World History" },
  { title: "GK", icon: "🌍", color: "teal", description: "General Knowledge" },
  { title: "Physics", icon: "⚡", color: "indigo", description: "Physics" },
  { title: "Chemistry", icon: "🧪", color: "green", description: "Chemistry" },
  { title: "Biology", icon: "🧬", color: "red", description: "Biology" },
];

export default function Home() {
  const [folders, setFolders] = useState([]);
  const [progress, setProgress] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("blue");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    setShowPopup(true);
    const timer = setTimeout(() => setShowPopup(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  const loadData = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
      const [existingFolders, existingProgress] = await Promise.all([
        base44.entities.Folder.list(),
        base44.entities.Progress.list(),
      ]);

      if (existingFolders.length === 0) {
        await seedDefaultData();
        const seededFolders = await base44.entities.Folder.list();
        setFolders(seededFolders);
      } else {
        setFolders(existingFolders);
      }
      setProgress(existingProgress);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultData = async () => {
    const created = await base44.entities.Folder.bulkCreate(
      DEFAULT_FOLDERS.map(f => ({ ...f, is_default: true }))
    );

    const flashcardsData = {
      Science: [
        { question: "What is the chemical formula of water?", answer: "H₂O" },
        { question: "What planet is known as the Red Planet?", answer: "Mars" },
        { question: "What gas do plants absorb from the atmosphere?", answer: "Carbon Dioxide (CO₂)" },
        { question: "What is the speed of light?", answer: "Approximately 3 × 10⁸ m/s" },
        { question: "What is the powerhouse of the cell?", answer: "Mitochondria" },
      ],
      Maths: [
        { question: "What is the value of π (pi)?", answer: "Approximately 3.14159" },
        { question: "What is the square root of 144?", answer: "12" },
        { question: "What is the formula for the area of a circle?", answer: "πr²" },
        { question: "What is 15% of 200?", answer: "30" },
        { question: "What is the Pythagorean theorem?", answer: "a² + b² = c²" },
      ],
      Art: [
        { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
        { question: "What are the three primary colors?", answer: "Red, Blue, Yellow" },
        { question: "What is the art technique of light and shadow called?", answer: "Chiaroscuro" },
        { question: "Who sculpted the statue of David?", answer: "Michelangelo" },
        { question: "What art movement did Salvador Dalí belong to?", answer: "Surrealism" },
      ],
      History: [
        { question: "In which year did World War II end?", answer: "1945" },
        { question: "Who was the first President of the United States?", answer: "George Washington" },
        { question: "What ancient wonder was located in Egypt?", answer: "The Great Pyramid of Giza" },
        { question: "Who discovered America in 1492?", answer: "Christopher Columbus" },
        { question: "What was the Renaissance?", answer: "A cultural rebirth in Europe (14th-17th century)" },
      ],
      GK: [
        { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean" },
        { question: "How many continents are there?", answer: "Seven" },
        { question: "What is the tallest mountain in the world?", answer: "Mount Everest" },
        { question: "What is the currency of Japan?", answer: "Yen" },
        { question: "Which country is known as the Land of the Rising Sun?", answer: "Japan" },
      ],
      Physics: [
        { question: "What is Newton's First Law of Motion?", answer: "An object at rest stays at rest unless acted upon by a force" },
        { question: "What is the unit of force?", answer: "Newton (N)" },
        { question: "What is the formula for kinetic energy?", answer: "KE = ½mv²" },
        { question: "What is Ohm's Law?", answer: "V = IR" },
        { question: "What type of energy does a moving object have?", answer: "Kinetic Energy" },
      ],
      Chemistry: [
        { question: "What is the atomic number of Carbon?", answer: "6" },
        { question: "What is the pH of pure water?", answer: "7 (neutral)" },
        { question: "What is the most abundant gas in Earth's atmosphere?", answer: "Nitrogen (78%)" },
        { question: "What is an isotope?", answer: "Atoms of the same element with different mass numbers" },
        { question: "What is the chemical symbol for Gold?", answer: "Au" },
      ],
      Biology: [
        { question: "What is DNA short for?", answer: "Deoxyribonucleic Acid" },
        { question: "What is photosynthesis?", answer: "Process by which plants convert sunlight to energy" },
        { question: "How many chromosomes do humans have?", answer: "46 (23 pairs)" },
        { question: "What is the largest organ in the human body?", answer: "Skin" },
        { question: "What carries oxygen in the blood?", answer: "Red Blood Cells (Hemoglobin)" },
      ],
    };

    const mcqData = {
      Science: [
        { question: "Which planet is closest to the Sun?", option_a: "Venus", option_b: "Mercury", option_c: "Mars", option_d: "Earth", correct_option: "B" },
        { question: "What is the boiling point of water?", option_a: "90°C", option_b: "100°C", option_c: "110°C", option_d: "80°C", correct_option: "B" },
        { question: "Which gas is most abundant in the atmosphere?", option_a: "Oxygen", option_b: "Hydrogen", option_c: "Nitrogen", option_d: "CO₂", correct_option: "C" },
        { question: "How many bones are in the adult human body?", option_a: "206", option_b: "208", option_c: "204", option_d: "210", correct_option: "A" },
        { question: "What type of animal is a frog?", option_a: "Reptile", option_b: "Mammal", option_c: "Amphibian", option_d: "Fish", correct_option: "C" },
      ],
      Maths: [
        { question: "What is 7 × 8?", option_a: "54", option_b: "56", option_c: "58", option_d: "52", correct_option: "B" },
        { question: "What is the value of 2⁵?", option_a: "16", option_b: "32", option_c: "64", option_d: "10", correct_option: "B" },
        { question: "A triangle has angles summing to?", option_a: "360°", option_b: "270°", option_c: "180°", option_d: "90°", correct_option: "C" },
        { question: "What is the LCM of 4 and 6?", option_a: "24", option_b: "12", option_c: "18", option_d: "6", correct_option: "B" },
        { question: "What is 0.5 as a fraction?", option_a: "1/3", option_b: "1/4", option_c: "1/2", option_d: "2/3", correct_option: "C" },
      ],
      Physics: [
        { question: "What is the SI unit of electric current?", option_a: "Volt", option_b: "Watt", option_c: "Ampere", option_d: "Ohm", correct_option: "C" },
        { question: "Which color of light has the longest wavelength?", option_a: "Blue", option_b: "Green", option_c: "Red", option_d: "Violet", correct_option: "C" },
        { question: "What is the acceleration due to gravity?", option_a: "9.8 m/s²", option_b: "10.8 m/s²", option_c: "8.8 m/s²", option_d: "11 m/s²", correct_option: "A" },
        { question: "Sound cannot travel through:", option_a: "Air", option_b: "Water", option_c: "Steel", option_d: "Vacuum", correct_option: "D" },
        { question: "What instrument measures atmospheric pressure?", option_a: "Thermometer", option_b: "Barometer", option_c: "Hygrometer", option_d: "Voltmeter", correct_option: "B" },
      ],
    };

    const allFlashcards = [];
    const allMcqs = [];

    for (const folder of created) {
      const fc = flashcardsData[folder.title];
      if (fc) {
        fc.forEach(card => {
          allFlashcards.push({ ...card, folder_id: folder.id, is_default: true });
        });
      }
      const mcq = mcqData[folder.title];
      if (mcq) {
        mcq.forEach(q => {
          allMcqs.push({ ...q, folder_id: folder.id, is_default: true });
        });
      }
    }

    if (allFlashcards.length > 0) await base44.entities.Flashcard.bulkCreate(allFlashcards);
    if (allMcqs.length > 0) await base44.entities.MCQ.bulkCreate(allMcqs);
  };

  const handleDeleteFolder = async (id) => {
    await base44.entities.Folder.delete(id);
    setFolders(f => f.filter(x => x.id !== id));
  };

  const handleAddFolder = async () => {
    if (!newTitle.trim()) return;
    const folder = await base44.entities.Folder.create({
      title: newTitle,
      icon: "📁",
      color: newColor,
      description: newTitle,
    });
    setFolders(f => [...f, folder]);
    setNewTitle("");
    setShowAdd(false);
  };

  const filtered = folders.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudied = progress.reduce((sum, p) => sum + (p.cards_studied || 0), 0);
  const totalCorrect = progress.reduce((sum, p) => sum + (p.mcq_correct || 0), 0);
  const totalMcq = progress.reduce((sum, p) => sum + (p.mcq_total || 0), 0);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const colors = ["blue", "green", "purple", "orange", "pink", "teal", "red", "indigo", "yellow", "cyan"];
  const colorStyles = {
    blue: "bg-blue-500", green: "bg-emerald-500", purple: "bg-purple-500",
    orange: "bg-orange-500", pink: "bg-pink-500", teal: "bg-teal-500",
    red: "bg-red-500", indigo: "bg-indigo-500", yellow: "bg-amber-500", cyan: "bg-cyan-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Brain size={18} className="text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold">FlashQuiz</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Settings size={18} />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => base44.auth.logout("/")}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h2 className="text-2xl font-bold">
            Hey, {user?.full_name?.split(" ")[0] || "Student"} 👋
          </h2>
          <p className="text-muted-foreground text-sm">Ready to learn something new today?</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Link to="/progress" className="bg-blue-50 rounded-2xl p-3 text-center hover:bg-blue-100 transition-colors">
            <BookOpen size={20} className="text-blue-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-700">{totalStudied}</p>
            <p className="text-xs text-blue-500">Cards Studied</p>
          </Link>
          <Link to="/progress" className="bg-emerald-50 rounded-2xl p-3 text-center hover:bg-emerald-100 transition-colors">
            <TrendingUp size={20} className="text-emerald-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-emerald-700">
              {totalMcq > 0 ? Math.round((totalCorrect / totalMcq) * 100) : 0}%
            </p>
            <p className="text-xs text-emerald-500">MCQ Score</p>
          </Link>
          <Link to="/progress" className="bg-purple-50 rounded-2xl p-3 text-center hover:bg-purple-100 transition-colors">
            <Brain size={20} className="text-purple-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-purple-700">{folders.length}</p>
            <p className="text-xs text-purple-500">Quiz Folders</p>
          </Link>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search quiz folders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11 border-muted"
          />
        </div>

        {/* Folders grid */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Quiz Folders
          </h3>
          <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={() => setShowAdd(true)}>
            <Plus size={14} className="mr-1" /> New Folder
          </Button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {filtered.map((folder, i) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <FolderCard
                folder={folder}
                progress={progress.find(p => p.folder_id === folder.id)}
                onDelete={handleDeleteFolder}
                canDelete={!folder.is_default}
              />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p>No folders match your search</p>
          </div>
        )}
      </div>

      {/* Welcome Popup */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl shrink-0">
              🎓
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Welcome back! 👋</p>
              <p className="text-xs text-muted-foreground">Let's make today a productive study day.</p>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Add Folder Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Folder Name</Label>
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Geography"
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`w-8 h-8 rounded-full ${colorStyles[c]} ${
                      newColor === c ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <Button onClick={handleAddFolder} className="w-full rounded-xl">
              Create Folder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}