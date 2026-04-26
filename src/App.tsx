/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Heart, Music, Pause, Play, Calendar, Star, Sparkles, Send, MessageSquareHeart, ChevronDown, Camera, MapPin, Quote, Gift, RefreshCw, Gamepad2, Trophy, Target } from 'lucide-react';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import confetti from 'canvas-confetti';

// --- Types ---
interface Message {
  id: string;
  text: string;
  timestamp: Date;
}

// --- Components ---

const MouseSparkles = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; scale: number }[]>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.8) {
        const id = Date.now();
        setSparkles(prev => [...prev, { id, x: e.clientX, y: e.clientY, scale: Math.random() }].slice(-10));
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== id));
        }, 1000);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: s.scale * 2, y: -20 }}
          style={{ left: s.x, top: s.y }}
          className="absolute"
        >
          <Sparkles className="text-romantic-pink" size={16} />
        </motion.div>
      ))}
    </div>
  );
};

const LoveQuest = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showPrize, setShowPrize] = useState(false);

  const spawnHeart = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = 10 + Math.random() * 80; // 10% to 90%
    const y = 10 + Math.random() * 80;
    setHearts(prev => [...prev, { id, x, y }]);
    
    // Remove heart if not clicked after 3 seconds
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    let interval: any;
    if (gameStarted && score < 10) {
      interval = setInterval(spawnHeart, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, score, spawnHeart]);

  useEffect(() => {
    if (score >= 10) {
      setShowPrize(true);
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 }
      });
    }
  }, [score]);

  const catchHeart = (id: number) => {
    setScore(prev => prev + 1);
    setHearts(prev => prev.filter(h => h.id !== id));
    
    const words = ["حب", "سحر", "للأبد", "ابتسامة", "جمال", "لطف", "توأم روح", "مستقبل", "أمل", "سعادة"];
    const word = words[score % words.length];
    
    // Mini word animation
    const el = document.createElement('div');
    el.innerText = word;
    el.className = "fixed pointer-events-none font-sans text-2xl text-romantic-red font-bold z-[70] transition-all duration-1000 opacity-0 transform -translate-y-10";
    // Positioning should be absolute relative to viewport if we had mouse coords, but let's just show it near center
    el.style.left = "50%";
    el.style.top = "50%";
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translate(-50%, -100%)";
    }, 10);
    setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => document.body.removeChild(el), 500);
    }, 1500);
  };

  return (
    <div className="relative min-h-[500px] w-full glass rounded-[3rem] p-8 flex flex-col items-center justify-center overflow-hidden">
      {!gameStarted ? (
        <div className="text-center space-y-6">
          <Gamepad2 className="mx-auto text-romantic-red" size={48} />
          <h3 className="text-3xl font-serif font-bold text-gray-800">صائدة القلوب</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            اصطادي 10 قلوب سحرية لتكشفي عن رسالتي السرية لكِ. هل أنت مستعدة يا حبيبتي؟
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameStarted(true)}
            className="bg-romantic-red text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-romantic-red/40"
          >
            ابدئي المهمة
          </motion.button>
        </div>
      ) : showPrize ? (
        <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 z-10"
        >
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-romantic-pink">
             <Trophy className="mx-auto text-yellow-500 mb-4" size={50} />
             <h3 className="text-4xl font-serif font-bold text-romantic-red mb-4">لقد فزتِ بقلبي!</h3>
             <p className="text-xl font-serif italic text-gray-700 leading-relaxed">
               "ببراعة فائقة، التقطتِ كل ذرة من حبي. لكن الحقيقة هي أنني سلمتُه لكِ منذ اليوم الأول. أنتِ لا تصطادين القلوب فحسب؛ بل تجعلينها تخفق بشدة. أحبكِ أكثر مما يمكن للكلمات وصفه."
             </p>
             <button 
                onClick={() => {setScore(0); setGameStarted(false); setShowPrize(false);}}
                className="mt-8 text-romantic-pink font-bold hover:underline"
             >
                العب من جديد
             </button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <Heart className="text-romantic-red fill-romantic-red" size={20} />
            <span className="font-bold text-xl text-romantic-red">{score} / 10</span>
          </div>
          <p className="absolute top-6 right-6 text-gray-400 text-sm italic">التقطيهم بسرعة!</p>
          
          <AnimatePresence>
            {hearts.map(h => (
              <motion.button
                key={h.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 2 }}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                className="absolute p-3 text-romantic-red cursor-pointer hover:scale-125 transition-transform"
                onClick={() => catchHeart(h.id)}
              >
                <Heart className="fill-romantic-red shadow-lg" size={32} />
              </motion.button>
            ))}
          </AnimatePresence>
          
          {score === 0 && (
            <div className="text-romantic-pink/30 animate-bounce">
                <Target size={100} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const DriftingPetals = () => {
  const [petals, setPetals] = useState<{ id: number; left: string; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * (25 - 15) + 15,
      duration: Math.random() * (20 - 10) + 10,
      delay: Math.random() * 10,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal text-romantic-pink/40"
          style={{
            left: p.left,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
};

const LoveTimelineItem = ({ date, title, description, icon: Icon, index }: any) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className={`flex items-center w-full mb-12 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
  >
    <div className="hidden md:block w-1/2" />
    <div className="z-20 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border-4 border-romantic-pink">
      <Icon className="text-romantic-red" size={20} />
    </div>
    <div className={`w-full md:w-1/2 p-4 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
      <div className="glass p-6 rounded-2xl">
        <span className="text-romantic-red font-bold text-xs uppercase tracking-widest">{date}</span>
        <h3 className="text-xl font-serif font-bold mt-1 text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="text-center mb-16 px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{children}</h2>
      {subtitle && <p className="text-romantic-red font-cursive text-2xl">{subtitle}</p>}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="h-[2px] w-12 bg-romantic-pink/30" />
        <Heart className="text-romantic-red fill-romantic-red" size={16} />
        <div className="h-[2px] w-12 bg-romantic-pink/30" />
      </div>
    </motion.div>
  </div>
);

// --- Main App ---

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentCompliment, setCurrentCompliment] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const compliments = [
    "الطريقة التي تلمع بها عيناكِ عندما تكونين متحمسة.",
    "لطفكِ المعهود تجاه كل من تقابلينه.",
    "الطريقة التي تجعلين بها أبسط اللحظات تبدو كأنها سحر.",
    "قوتكِ المذهلة وصمودكِ الرائع.",
    "الطريقة التي تعرفين بها دائماً ما تقولينه لتجعليني أبتسم.",
    "شغفكِ الكبير بالأشياء التي تحبينها.",
    "دفء يدكِ وهي في يدي.",
    "كم تبدين جميلة عندما تستيقظين للتو.",
    "ضحكتكِ، هي أغنيتي المفضلة دائماً."
  ];

  const nextCompliment = () => {
    setCurrentCompliment((prev) => (prev + 1) % compliments.length);
    confetti({
      particleCount: 15,
      scalar: 0.7,
      colors: ['#ff4d6d']
    });
  };
  
  const anniversaryDate = new Date('2010-05-05T00:00:00');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalDays = differenceInDays(now, anniversaryDate);
  const hours = differenceInHours(now, anniversaryDate) % 24;
  const minutes = differenceInMinutes(now, anniversaryDate) % 60;
  const seconds = differenceInSeconds(now, anniversaryDate) % 60;

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
      colors: ['#ff4d6d', '#ff85a1', '#ffccd5']
    });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: new Date(),
    };

    setMessages([newMessage, ...messages]);
    setInputText('');
    
    // Celebration for sending a heart
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.9 },
      colors: ['#ff4d6d']
    });
  };

  const timelineData = [
    { date: '5 مايو 2010', title: 'الشرارة الأولى', description: "اليوم الذي بدأت فيه رحلتنا. لحظة غيرت كل شيء للأبد.", icon: Sparkles },
    { date: '14 فبراير 2011', title: 'موعدنا الأول', description: "فراشات في المعدة وابتسامات خجولة. كانت بداية مثالية.", icon: Heart },
    { date: '10 يونيو 2015', title: 'ذكريات الصيف', description: "تلك النزهات الطويلة والمحادثات التي لا تنتهي تحت أشعة الشمس.", icon: Camera },
    { date: '25 ديسمبر 2020', title: 'أول عطلة معاً', description: "خلق تقاليدنا الخاصة والاحتفال معاً.", icon: Star },
  ];

  return (
    <div className="min-h-screen relative bg-romantic-bg selection:bg-romantic-pink/30">
      <DriftingPetals />

      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-white"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="relative mb-12"
            >
              <motion.button
                onClick={handleOpen}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-48 h-48 flex items-center justify-center cursor-pointer group"
              >
                <Heart className="w-full h-full text-romantic-red fill-romantic-red drop-shadow-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-serif text-3xl font-bold tracking-widest group-hover:scale-110 transition-transform">إلى ندى</span>
                </div>
                <div className="absolute -inset-8 bg-romantic-pink/20 rounded-full blur-3xl -z-10 animate-pulse" />
              </motion.button>
            </motion.div>
            
            <div className="text-center space-y-4 max-w-sm">
              <h1 className="text-5xl font-serif font-bold text-gray-900 leading-tight">
                حب <span className="text-romantic-red">يزدهر</span> دائماً
              </h1>
              <p className="text-gray-400 font-sans italic text-lg">
                قلبكِ يخفي سراً ينتظركِ في الداخل...
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* STICKY NAV */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
              <div className="max-w-max mx-auto glass px-6 py-3 rounded-full flex items-center gap-6 pointer-events-auto">
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-romantic-red hover:scale-110 transition-transform"><Heart size={20}/></button>
                <div className="w-[1px] h-4 bg-romantic-pink/30" />
                <button onClick={() => document.getElementById('journey')?.scrollIntoView({behavior:'smooth'})} className="text-gray-600 hover:text-romantic-red font-bold text-[10px] uppercase tracking-widest">رحلتنا</button>
                <button onClick={() => document.getElementById('gallery')?.scrollIntoView({behavior:'smooth'})} className="text-gray-600 hover:text-romantic-red font-bold text-[10px] uppercase tracking-widest">الذكريات</button>
                <button onClick={() => document.getElementById('quest')?.scrollIntoView({behavior:'smooth'})} className="text-gray-600 hover:text-romantic-red font-bold text-[10px] uppercase tracking-widest">اللعبة</button>
                <button onClick={() => document.getElementById('letter')?.scrollIntoView({behavior:'smooth'})} className="text-gray-600 hover:text-romantic-red font-bold text-[10px] uppercase tracking-widest">رسالتي</button>
              </div>
            </nav>

            {/* HERO SECTION */}
            <MouseSparkles />
            <section className="min-h-screen flex flex-col items-center justify-center relative p-6">
              <div className="absolute top-8 right-8 z-30">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMusic}
                  className="p-4 bg-white/50 backdrop-blur-md rounded-full shadow-lg text-romantic-red hover:bg-white transition-all"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </motion.button>
              </div>

              <div className="max-w-4xl w-full text-center z-10 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-romantic-red font-bold tracking-[0.3em] uppercase text-sm mb-4 block">كل شـيء بالنسـبة لي</span>
                  <h1 className="text-7xl md:text-9xl font-serif font-bold text-gray-900 mb-6 px-4">
                    ندى
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="glass p-10 rounded-[3rem] shadow-xl relative mt-12 bg-white/60"
                >
                  <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-8">كل ثانية منذ أن التقينا</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                      { label: 'أيام', value: totalDays },
                      { label: 'ساعات', value: hours },
                      { label: 'دقائق', value: minutes },
                      { label: 'ثوانٍ', value: seconds },
                    ].map((item) => (
                      <div key={item.label} className="relative group">
                        <div className="text-4xl md:text-6xl font-serif font-bold text-romantic-red tabular-nums">
                          {item.value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mt-2 font-bold">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="pt-16 flex flex-col items-center text-gray-400 gap-2 cursor-pointer"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                  <span className="text-xs uppercase tracking-widest font-bold">تعمقي في قلبي أكثر</span>
                  <ChevronDown size={20} />
                </motion.div>
              </div>
            </section>

            {/* TIMELINE SECTION */}
            <section id="journey" className="py-32 px-6 max-w-5xl mx-auto relative">
              <SectionHeading subtitle="لحظاتنا الصغيرة والكبيرة">رحلتنا مـعاً</SectionHeading>
              
              <div className="relative">
                <div className="absolute right-6 md:right-1/2 transform translate-x-1/2 h-full w-[2px] timeline-line opacity-30" />
                {timelineData.map((item, idx) => (
                  <LoveTimelineItem key={idx} {...item} index={idx} />
                ))}
              </div>
            </section>

            {/* GALLERY SECTION */}
            <section id="gallery" className="py-32 px-6 bg-white/30 backdrop-blur-sm">
              <SectionHeading subtitle="توثيق ابتسامتِك">مخزن الذكريات</SectionHeading>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069",
                    caption: "عندما كانت السماء بجمالكِ تماماً.",
                    loc: "غروب الشمس في الحديقة"
                  },
                  {
                    src: "https://images.unsplash.com/photo-1516589174184-c6848b116743?q=80&w=1974",
                    caption: "الطريقة التي تضحكين بها...",
                    loc: "مواعيد المقاهي السرية"
                  },
                  {
                    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070",
                    caption: "كل تفاصيلكِ تستحق التذكر.",
                    loc: "رحلات الشتاء"
                  }
                ].map((photo, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="group"
                  >
                    <div className="bg-white p-4 rounded-b-none rounded-t-[2rem] shadow-lg overflow-hidden">
                      <div className="aspect-[4/5] overflow-hidden rounded-2xl relative">
                        <img 
                          src={photo.src} 
                          alt="Special Memory" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-romantic-red/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-t-none rounded-b-[2rem] shadow-lg border-t border-romantic-bg">
                      <div className="flex items-center gap-2 text-romantic-red mb-2">
                        <MapPin size={12} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">{photo.loc}</span>
                      </div>
                      <p className="font-serif italic text-gray-700">{photo.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* COMPLIMENT BOX */}
            <section className="py-20 px-6">
              <div className="max-w-2xl mx-auto glass rounded-[2.5rem] p-12 text-center relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-romantic-pink/10 rounded-full blur-2xl group-hover:bg-romantic-pink/20 transition-colors" />
                <Gift className="mx-auto text-romantic-red mb-6" size={40} />
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">سبب يجعلني أحبكِ</h3>
                <p className="text-romantic-red font-cursive text-xl mb-8">اضغطي للكشف عن مفاجأة</p>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCompliment}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -10 }}
                    className="min-h-[80px] flex items-center justify-center"
                  >
                    <p className="text-xl font-serif italic text-gray-700 leading-relaxed">
                      "{compliments[currentCompliment]}"
                    </p>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  whileHover={{ rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextCompliment}
                  className="mt-10 p-4 bg-romantic-red text-white rounded-full shadow-lg hover:shadow-romantic-red/40 transition-all"
                >
                  <RefreshCw size={24} />
                </motion.button>
              </div>
            </section>

            {/* GAME SECTION */}
            <section id="quest" className="py-32 px-6 max-w-4xl mx-auto">
              <SectionHeading subtitle="اصطادي مشاعري">مهمة الحب</SectionHeading>
              <LoveQuest />
            </section>

            {/* LETTER & INTERACTIVE MESSAGES */}
            <section id="letter" className="py-32 px-6 max-w-4xl mx-auto">
              <div className="glass rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
                <Quote className="absolute top-8 right-8 text-romantic-pink/20" size={80} />
                
                <div className="relative z-10 text-center space-y-8">
                  <h2 className="text-4xl font-serif font-bold text-gray-900 italic">عزيزتي ندى،</h2>
                  <p className="text-xl text-gray-700 font-serif leading-relaxed italic max-w-2xl mx-auto">
                    "لو كان بإمكاني منحكِ شيئاً واحداً في هذه الحياة، لمنحتكِ القدرة على رؤية نفسكِ من خلال عيني، عندها فقط ستدركين كم أنتِ مميزة حقاً بالنسبة لي. أنتِ موطني، وسلامي، وأعظم مغامراتي."
                  </p>
                  
                  <div className="pt-12 border-t border-romantic-pink/20">
                    <h3 className="text-romantic-red font-bold uppercase tracking-widest text-xs mb-8 flex items-center justify-center gap-2">
                      <MessageSquareHeart size={16} />
                      اتركي نبضة قلب
                    </h3>
                    
                    <form onSubmit={sendMessage} className="flex gap-4 max-w-md mx-auto mb-12">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="اكتبي ملاحظة صغيرة..."
                        className="flex-1 bg-white/50 border border-romantic-pink/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-romantic-pink transition-all font-sans"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-romantic-red text-white p-4 rounded-2xl shadow-lg hover:shadow-romantic-red/30 transition-all font-sans"
                      >
                        <Send size={20} />
                      </motion.button>
                    </form>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto px-4 custom-scrollbar">
                      <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            className="bg-white/80 p-5 rounded-2xl shadow-sm text-right border-r-4 border-romantic-red"
                          >
                            <p className="text-gray-700 font-sans">{msg.text}</p>
                            <span className="text-[10px] text-gray-400 mt-2 block uppercase tracking-wider">
                               أُرسلت الساعة {format(msg.timestamp, 'p')}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {messages.length === 0 && (
                        <p className="text-gray-400 italic text-sm font-serif">لا توجد رسائل هنا بعد. قولي شيئاً جميلاً...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 text-center text-gray-400 px-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart size={16} className="text-romantic-red fill-romantic-red" />
                <span className="font-serif text-2xl text-romantic-red">دائماً لكِ</span>
                <Heart size={16} className="text-romantic-red fill-romantic-red" />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold">صُنع خصيصاً لندى • 2026</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ffccd5;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
