import React from 'react';

type Props = {
  message: string;
  type?: 'success' | 'error' | 'info';
};

export default function Toast({ message, type = 'info' }: Props) {
  if (!message) return null;
  const bg = type === 'success' ? 'bg-emerald-400/10 border-emerald-300/25' :
            type === 'error' ? 'bg-rose-400/10 border-rose-300/25' :
            'bg-cyan-400/10 border-cyan-300/25';
  return (
    <div className={`mt-3 p-3 rounded-xl border ${bg}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
