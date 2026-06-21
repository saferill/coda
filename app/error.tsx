'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page crashed:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-white/50" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Halaman mengalami gangguan</h2>
      <p className="text-white/60 mb-8 max-w-md">
        Jangan khawatir, musik Anda akan tetap berputar. Silakan muat ulang bagian ini.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform"
      >
        <RefreshCcw className="w-5 h-5" />
        Muat Ulang Halaman
      </button>
    </div>
  );
}
