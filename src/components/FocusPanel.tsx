'use client';

import { List, Plus, Target, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FocusPanel() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('STRATEGIC');

  useEffect(() => {
    const saved = localStorage.getItem('war-room-focus');
    if (saved) {
      const { tasks, theme } = JSON.parse(saved);
      setTasks(tasks);
      setTheme(theme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('war-room-focus', JSON.stringify({ tasks, theme }));
  }, [tasks, theme]);

  const addTask = () => {
    if (input && tasks.length < 3) {
      setTasks([...tasks, input]);
      setInput('');
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="card-professional p-5 space-y-5 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-on-surface">
          <Target size={16} className="text-primary" />
          Focal Objectives
        </h2>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-surface-container-low border border-outline-variant text-[10px] font-bold uppercase px-2 py-1 rounded-sm cursor-pointer hover:bg-surface-container transition-colors"
        >
          <option>STRATEGIC</option>
          <option>OPERATIONAL</option>
          <option>FINANCIAL</option>
          <option>TECHNICAL</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 text-xs"
            placeholder="Add new objective..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button
            type="button"
            onClick={addTask}
            disabled={tasks.length >= 3}
            className="btn-standard p-2 bg-primary text-on-primary rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task}
              className="group flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant rounded-sm hover:border-outline transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[11px] font-medium text-on-surface">{task}</span>
              </div>
              <button
                type="button"
                onClick={() => removeTask(tasks.indexOf(task))}
                className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant/40 hover:text-error transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-[11px] text-on-surface-variant/40 italic text-center py-6 bg-surface-container-low/50 border border-dashed border-outline-variant rounded-sm">
              No active objectives defined.
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 flex justify-between items-center text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase border-t border-outline-variant">
        <div className="flex items-center gap-1.5">
          <List size={12} />
          {theme}
        </div>
        <div>{tasks.length} / 3</div>
      </div>
    </div>
  );
}
