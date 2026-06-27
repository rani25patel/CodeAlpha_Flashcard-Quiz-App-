import React from "react";
import { BookOpen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const colorMap = {
  blue: "from-blue-500 to-blue-600",
  green: "from-emerald-500 to-emerald-600",
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600",
  pink: "from-pink-500 to-pink-600",
  teal: "from-teal-500 to-teal-600",
  red: "from-red-500 to-red-600",
  indigo: "from-indigo-500 to-indigo-600",
  yellow: "from-amber-500 to-amber-600",
  cyan: "from-cyan-500 to-cyan-600",
};

const iconMap = {
  "🔬": "🔬", "📐": "📐", "🎨": "🎨", "📜": "📜",
  "🌍": "🌍", "⚡": "⚡", "🧪": "🧪", "🧬": "🧬",
};

export default function FolderCard({ folder, progress, onDelete, canDelete }) {
  const gradient = colorMap[folder.color] || "from-slate-500 to-slate-600";
  const pct = progress?.mcq_total > 0
    ? Math.round((progress.mcq_correct / progress.mcq_total) * 100)
    : 0;

  return (
    <div className="group relative">
      <Link to={`/folder/${folder.id}`}>
        <div className={`bg-gradient-to-br ${gradient} rounded-xl p-2.5 text-white 
          shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 
          cursor-pointer min-h-[88px] flex flex-col justify-between`}>
          <div className="flex items-start justify-between">
            <span className="text-lg">{folder.icon || "📚"}</span>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-[10px] font-medium">
              {pct}%
            </div>
          </div>
          <div className="mt-1">
            <h3 className="font-bold text-xs leading-tight truncate">{folder.title}</h3>
            <p className="text-white/70 text-[10px] mt-0.5 flex items-center gap-1 truncate">
              <BookOpen size={9} />
              {folder.description || "Quiz"}
            </p>
          </div>
          {progress?.mcq_total > 0 && (
            <div className="mt-1.5 bg-white/20 rounded-full h-1 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>
      </Link>
      {canDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 
            opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}