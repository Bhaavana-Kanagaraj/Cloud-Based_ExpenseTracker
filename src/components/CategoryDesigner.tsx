import React, { useState } from "react";
import { Sparkles, Plus, AlertCircle, Trash2, Heart, Gift, Compass, BookOpen, Briefcase, Shield, Landmark, Plane, Phone, Award, Tag, Eye } from "lucide-react";
import { motion } from "motion/react";

export interface CustomCategory {
  name: string;
  color: string;
  bg: string;
  text: string;
  iconName: string;
}

interface CategoryDesignerProps {
  customCategories: CustomCategory[];
  onAddCategory: (cat: CustomCategory) => void;
  onRemoveCategory: (name: string) => void;
  defaultCategories: { [key: string]: { color: string; bg: string; text: string; icon: any } };
}

// Preset modern color palettes (hex, bg Tailwind class, text Tailwind class)
const COLORS_PRESETS = [
  { hex: "#6366f1", bg: "bg-indigo-50", text: "text-indigo-700", label: "Indigo" },
  { hex: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", label: "Emerald" },
  { hex: "#f97316", bg: "bg-orange-50", text: "text-orange-700", label: "Orange" },
  { hex: "#ec4899", bg: "bg-pink-50", text: "text-pink-700", label: "Pink" },
  { hex: "#8b5cf6", bg: "bg-purple-50", text: "text-purple-700", label: "Purple" },
  { hex: "#06b6d4", bg: "bg-cyan-50", text: "text-cyan-700", label: "Cyan" },
  { hex: "#ef4444", bg: "bg-red-50", text: "text-red-700", label: "Red" },
  { hex: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", label: "Amber" },
  { hex: "#0f172a", bg: "bg-slate-100", text: "text-slate-800", label: "Charcoal" },
  { hex: "#84cc16", bg: "bg-lime-50", text: "text-lime-700", label: "Lime" },
];

const ICONS_PRESETS = [
  { name: "Sparkles", label: "Sparkles" },
  { name: "Heart", label: "Heart/Care" },
  { name: "Gift", label: "Gifts/Discounts" },
  { name: "Compass", label: "Travel/Adventure" },
  { name: "BookOpen", label: "Education/Books" },
  { name: "Briefcase", label: "Business/SaaS" },
  { name: "Shield", label: "Insurance/Security" },
  { name: "Landmark", label: "Investments/SIP" },
  { name: "Plane", label: "Vacations" },
  { name: "Phone", label: "Mobile/Internet" },
  { name: "Award", label: "Rewards/Memberships" },
];

export default function CategoryDesigner({
  customCategories,
  onAddCategory,
  onRemoveCategory,
  defaultCategories,
}: CategoryDesignerProps) {
  const [name, setName] = useState("");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedIconName, setSelectedIconName] = useState("Landmark");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    // Check collision with defaults
    if (defaultCategories[trimmedName]) {
      setError(`"${trimmedName}" is a default system category and cannot be overwritten.`);
      return;
    }

    // Check collision with existing custom categories
    if (customCategories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError(`"${trimmedName}" already exists as a custom category.`);
      return;
    }

    const colorObj = COLORS_PRESETS[selectedColorIdx];
    onAddCategory({
      name: trimmedName,
      color: colorObj.hex,
      bg: colorObj.bg,
      text: colorObj.text,
      iconName: selectedIconName,
    });

    setName("");
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* HEADER ROW */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 p-6 rounded-3xl text-white shadow-md border border-indigo-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-600/50 rounded-2xl text-cyan-300">
            <Tag className="w-5 h-5" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold font-display">Bespoke Category Architect</h1>
        </div>
        <p className="text-slate-300 text-xs md:text-sm">
          Expand your transaction indexing rules! Construct personalized ledger tags, assign branding schemes, and watch the AI seamlessly categorize incoming files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Creation Form (5 columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-indigo-500" />
            Design Custom Tag
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-150 text-rose-700 rounded-xl text-xs flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Name input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                Category Label *
              </label>
              <input
                type="text"
                required
                maxLength={25}
                placeholder="e.g., Investments, Subscriptions, Travel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Color preset grid */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-2">
                Brand Color Palette *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS_PRESETS.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`h-9 w-full rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                      selectedColorIdx === idx ? "border-indigo-600 scale-105" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                  </button>
                ))}
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                Vector Icon Symbol *
              </label>
              <select
                value={selectedIconName}
                onChange={(e) => setSelectedIconName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {ICONS_PRESETS.map((icon, idx) => (
                  <option key={idx} value={icon.name}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
              <span className="text-[9px] font-bold text-slate-400 font-mono uppercase block mb-2.5 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500" /> Live Tag Preview
              </span>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${COLORS_PRESETS[selectedColorIdx].bg} ${COLORS_PRESETS[selectedColorIdx].text}`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  {name.trim() || "My New Category"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Deploy Custom Category
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Active categories grid (7 columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Tag className="w-4 h-4 text-indigo-500" />
              Active System & Custom Categories
            </h2>

            {/* System defaults */}
            <div className="mb-6">
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block mb-3">
                Pre-installed System tags
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(defaultCategories).map((catName, idx) => {
                  const val = defaultCategories[catName];
                  const IconComp = val.icon;
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${val.bg} ${val.text}`}
                    >
                      <IconComp className="w-3 h-3" />
                      {catName}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* User defined custom categories */}
            <div>
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block mb-3">
                Your Bespoke Custom Tags ({customCategories.length})
              </span>

              {customCategories.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-100 dark:border-slate-850 rounded-2xl text-slate-400 dark:text-slate-500">
                  <Tag className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs">No custom categories configured yet. Create one on the left!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center"
                    >
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cat.bg} ${cat.text}`}>
                        <Tag className="w-3 h-3" />
                        {cat.name}
                      </span>
                      <button
                        onClick={() => onRemoveCategory(cat.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer"
                        title="Delete bespoke category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-6 text-[10px] text-slate-400 dark:text-slate-500 font-mono text-center">
            Custom tags automatically link into receipt vision parsers
          </div>
        </div>
      </div>
    </div>
  );
}
