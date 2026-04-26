/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Music, Pause, Play, Calendar, Star, Sparkles, MessageCircleHeart } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import confetti from 'canvas-confetti';

// --- Components ---

const FallingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * (30 - 10) + 10,
      duration: Math.random() * (15 - 5) + 5,
      delay: Math.random() * 10,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="falling-item text-red-400 opacity-50"
          style={{
            left: heart.left,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

const LoveTimer = ({ startDate }: { startDate: Date }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalDays = differenceInDays(now, startDate);
  const hours = differenceInHours(now, startDate) % 24;
  const minutes = differenceInMinutes(now, startDate) % 60;
  const seconds = differenceInSeconds(now, startDate) % 60;

  return (
    <div className="grid grid-cols-4 gap-4 mt-8">
      {[
        { label: 'Days', value: totalDays },
        { label: 'Hours', value: hours },
        { label: 'Mins', value: minutes },
        { label: 'Secs', value: seconds },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-serif font-bold text-red-500">
            {item.value.toString().padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // You can customize this date
  const anniversaryDate = new Date('2023-01-01T00:00:00');

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleOpen = () => {
    setIsOpened(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff758c', '#ff7eb3', '#ff0000']
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-[#fff5f5]">
      <FallingHearts />

      {/* Hidden Audio Element - Replace URL with a real romantic song if needed */}
      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />

      <div className="z-10 w-full max-w-lg">
        {!isOpened ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center space-y-8"
          >
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-40 h-40 flex items-center justify-center cursor-pointer"
            >
              <Heart className="w-full h-full text-red-500 fill-red-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-cursive text-2xl font-bold">Open</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-red-400 rounded-full blur-2xl -z-10"
              />
            </motion.button>
            
            <div className="text-center space-y-2">
              <h1 className="text-4xl md:text-5xl font-cursive font-bold text-red-600">
                A Little Surprise for Anita
              </h1>
              <p className="text-gray-500 font-serif italic text-lg">
                Click the heart to unlock a world of memories...
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center"
          >
            {/* Corner Decorative Elements */}
            <div className="absolute top-4 left-4 text-red-300 opacity-50">
              <Sparkles size={24} />
            </div>
            <div className="absolute bottom-4 right-4 text-red-300 opacity-50">
              <Star size={24} />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-[1px] bg-red-300" />
                <Heart className="text-red-500 fill-red-500" size={24} />
                <div className="w-12 h-[1px] bg-red-300" />
              </div>

              <div className="space-y-2">
                <h2 className="text-5xl md:text-6xl font-cursive font-bold text-red-600">
                  Anita
                </h2>
                <div className="text-red-400 flex justify-center gap-1">
                  <Heart size={16} fill="currentColor" />
                  <Heart size={16} fill="currentColor" />
                  <Heart size={16} fill="currentColor" />
                </div>
              </div>

              <div className="py-6 border-y border-red-100/50">
                <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4">
                  TIME SPENT TOGETHER
                </p>
                <LoveTimer startDate={anniversaryDate} />
              </div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-gray-700 font-serif text-lg leading-relaxed italic">
                  "Every day with you is a new page in a beautiful story. You make my world brighter, my heart fuller, and my life more meaningful."
                </p>
                
                <div className="grid grid-cols-2 gap-2 pt-4">
                  {[
                    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop",
                    "https://images.unsplash.com/photo-1516589174184-c6848b116743?w=400&h=400&fit=crop",
                    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400&h=400&fit=crop",
                    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop"
                  ].map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + (i * 0.1) }}
                      className="aspect-square rounded-xl overflow-hidden shadow-inner border-2 border-white/50"
                    >
                      <img src={src} alt="Memory" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMusic}
                    className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-red-600 transition-colors w-full justify-center"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? 'Pause Our Song' : 'Play Our Song'}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-20">
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400 text-sm font-serif italic"
         >
           Made with <Heart size={12} className="text-red-400 fill-red-400" /> for Anita
         </motion.div>
      </div>
    </div>
  );
}
