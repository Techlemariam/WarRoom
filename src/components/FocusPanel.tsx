"use client";

import { useState, useEffect } from "react";
import { Target, Plus, Trash2 } from "lucide-react";

export default function FocusPanel() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("MONETIZATION");

  useEffect(() => {
    const saved = localStorage.getItem("war-room-focus");
    if (saved) {
      const { tasks, theme } = JSON.parse(saved);
      setTasks(tasks);
      setTheme(theme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("war-room-focus", JSON.stringify({ tasks, theme }));
  }, [tasks, theme]);

  const addTask = () => {
    if (input && tasks.length < 3) {
      setTasks([...tasks, input]);
      setInput("");
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="glass p-6 space-y-6 rounded-3xl overflow-hidden relative">
      <div className="flex justify-between items-center relative z-10">
        <h2 className="text-lg font-display font-bold tracking-tight flex items-center gap-2 text-on-surface">
          <Target size={20} className="text-secondary" />
          Focus Panel
        </h2>
        <select 
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase px-3 py-1.5 rounded-full cursor-pointer hover:bg-surface-container-highest transition-colors"
        >
          <option>MONETIZATION</option>
          <option>STABILIZE</option>
          <option>SHIP</option>
          <option>GROWTH</option>
        </select>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex gap-2">
          <input 
            type="text"
            className="flex-1 bg-surface-container-low text-on-surface px-4 py-2.5 text-xs font-medium rounded-full ring-1 ring-outline/10 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
            placeholder="Set focal objective..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button 
            onClick={addTask}
            disabled={tasks.length >= 3}
            className="p-2.5 bg-primary text-on-primary rounded-full disabled:bg-surface-container-highest disabled:text-on-surface-variant/40 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task, i) => (
            <div key={i} className="group flex items-center justify-between p-4 bg-surface-container/40 hover:bg-surface-container-high/60 rounded-2xl transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-medium text-on-surface">{task}</span>
              </div>
              <button 
                onClick={() => removeTask(i)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-on-surface-variant/60 hover:text-error hover:bg-error-container/20 rounded-full transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-[11px] text-on-surface-variant/60 italic text-center py-6 bg-surface-container-low/30 rounded-2xl">
              Equilibrium maintained. Define new directives.
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center text-[10px] font-mono font-bold text-on-surface-variant/40 tracking-widest uppercase relative z-10 border-t border-outline/5">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-secondary opacity-50" />
          {theme}
        </div>
        <div>{tasks.length}/3 CAP</div>
      </div>
    </div>
  );
}
