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
    <div className="glass p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase flex items-center gap-2">
          <Target size={20} className="text-accent" />
          Focus Panel
        </h2>
        <select 
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-surface border border-border text-[10px] font-bold uppercase px-2 py-1 focus:outline-none focus:border-accent"
        >
          <option>MONETIZATION</option>
          <option>STABILIZE</option>
          <option>SHIP</option>
          <option>GROWTH</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input 
            type="text"
            className="flex-1 bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent"
            placeholder="Add priority (max 3)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button 
            onClick={addTask}
            disabled={tasks.length >= 3}
            className="p-2 bg-accent text-background disabled:bg-surface disabled:text-text-secondary transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-surface border-l-2 border-accent transition-all hover:translate-x-1">
              <span className="text-xs font-mono">{task}</span>
              <button 
                onClick={() => removeTask(i)}
                className="text-text-secondary hover:text-error transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-xs text-text-secondary italic text-center py-4">
              All systems nominal. Set new priorities above.
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-between items-center text-[10px] font-mono text-text-secondary">
        <div>THEME: {theme}</div>
        <div>TASKS: {tasks.length}/3</div>
      </div>
    </div>
  );
}
