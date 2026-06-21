'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import Image from 'next/image';

export function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Hanya muncul sekali per sesi (akan hilang jika di-refresh, kembali muncul jika tab baru)
    const hasSeen = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeen) {
      setShow(true);
      // Mencegah scroll saat popup terbuka
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true');
    setShow(false);
    document.body.style.overflow = '';
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.1, 
            filter: 'blur(10px)',
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl"
        >
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 50, 0],
                y: [0, -50, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, -50, 0],
                y: [0, 50, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px]" 
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-2xl"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8, type: 'spring', stiffness: 100 }}
              className="w-24 h-24 md:w-32 md:h-32 mb-8 rounded-full overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] relative"
            >
              <Image 
                src="https://f.top4top.io/p_3733w0g4e0.jpg" 
                alt="Developer Profile" 
                fill
                sizes="(max-width: 768px) 96px, 128px"
                className="object-cover" 
              />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-4 tracking-tight drop-shadow-2xl">
              Welcome to Music App
            </h1>
            
            <p className="text-lg md:text-xl text-white/50 mb-12 max-w-md font-light">
              Crafted with passion by <span className="text-white/90 font-medium">Safe_rill</span>
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
            >
              <Play className="w-5 h-5 fill-current" />
              Mulai Mendengarkan
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
