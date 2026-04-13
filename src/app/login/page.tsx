'use client';

import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('AUTHENTICATION FAILED: INVALID CREDENTIALS');
      }
    } catch (_e) {
      setError('SYSTEM ERROR: UNABLE TO CONNECT');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm glass p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold uppercase tracking-tighter">War Room</h1>
          <p className="text-[10px] font-mono text-text-secondary uppercase">
            Secure Terminal Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="access-key"
              className="text-[10px] font-bold text-text-secondary uppercase"
            >
              Access Key
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                size={14}
              />
              <input
                id="access-key"
                type="password"
                required
                className="w-full bg-surface border border-border px-10 py-3 text-sm font-mono focus:outline-none focus:border-accent transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-[10px] font-mono text-error uppercase text-center border border-error/30 p-2 bg-error/5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-background font-bold py-3 uppercase text-xs tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Initiate Connection'}
          </button>
        </form>

        <div className="text-[9px] font-mono text-text-secondary text-center uppercase tracking-widest opacity-50">
          Encrypted Session | Node CX23
        </div>
      </div>
    </main>
  );
}
