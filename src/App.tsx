/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Heart, Music, Pause, Play, Calendar, Star, Sparkles, Send, MessageSquareHeart, ChevronDown, Camera, MapPin, Quote, Gift, RefreshCw, Gamepad2, Trophy, Target, Lock, Key, Clock } from 'lucide-react';
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
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;
    setHearts(prev => [...prev, { id, x, y }]);
    
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
    
    const words = ["نجاح", "إصرار", "قوة", "فخر", "طموح", "صبر", "إنجاز", "مستقبل", "أمل", "سعادة"];
    const word = words[score % words.length];
    
    const el = document.createElement('div');
    el.innerText = word;
    el.className = "fixed pointer-events-none font-sans text-2xl text-romantic-red font-bold z-[70] transition-all duration-1000 opacity-0 transform -translate-y-10";
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
          <h3 className="text-3xl font-serif font-bold text-gray-800">مهمة النجاح</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            التقطي 10 أهداف لتكشفي عن رسالتي التي تفخر بكِ. هل أنت مستعدة يا هداية؟
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameStarted(true)}
            className="bg-romantic-red text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-romantic-red/40"
          >
            ابدئي الآن
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
             <h3 className="text-4xl font-serif font-bold text-romantic-red mb-4">فخور بكِ دائماً!</h3>
             <p className="text-xl font-serif italic text-gray-700 leading-relaxed">
               "أنتِ شخصية قوية وقادرة تعتمدي على نفسك وبتحاولي تعملي اللي عليكي على قد ما تقدري وده في حد ذاته حاجة تستحق الاحترام جدًا. كملي وحلمك قرب يتحقق."
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
            <Star className="text-romantic-red fill-romantic-red" size={20} />
            <span className="font-bold text-xl text-romantic-red">{score} / 10</span>
          </div>
          <p className="absolute top-6 right-6 text-gray-400 text-sm italic">اصطادي النجاح!</p>
          
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
                <Sparkles className="fill-romantic-red shadow-lg" size={32} />
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
  const [petals, setPetals] = useState<{ id: number; left: string; size: number; duration: number; delay: number; xOffset: number }[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * (25 - 15) + 15,
      duration: Math.random() * (20 - 10) + 10,
      delay: Math.random() * -20, // Negative delay to start immediately at different positions
      xOffset: Math.random() * 100 - 50,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: "-10vh", x: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, 0.4, 0.4, 0],
            y: "110vh",
            x: [0, p.xOffset, p.xOffset * 1.5],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{
            left: p.left,
            fontSize: `${p.size}px`,
            color: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          🤍
        </motion.div>
      ))}
    </div>
  );
};

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="text-center mb-24 px-4 relative">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="inline-flex items-center justify-center gap-3 mb-6">
        <div className="h-[1px] w-8 bg-romantic-red/30" />
        <Star className="text-romantic-red animate-pulse" size={14} />
        <div className="h-[1px] w-8 bg-romantic-red/30" />
      </div>
      <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">{children}</h2>
      {subtitle && (
        <p className="text-romantic-red font-cursive text-3xl opacity-80 rotate-[-1deg] transform transition-transform hover:rotate-0 duration-500">
          {subtitle}
        </p>
      )}
    </motion.div>
  </div>
);

const LoveTimelineItem = ({ date, title, description, icon: Icon, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay: index * 0.1 }}
    className={`flex items-center w-full mb-20 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
  >
    <div className="hidden md:block w-1/2" />
    <div className="z-20 relative px-4">
      <motion.div 
        whileHover={{ scale: 1.2, rotate: 15 }}
        className="flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-xl border border-romantic-pink/20 text-romantic-red"
      >
        <Icon size={24} />
      </motion.div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 h-20 w-[1px] bg-romantic-pink/20" />
    </div>
    <div className={`w-full md:w-1/2 p-4 ${index % 2 === 0 ? 'md:pr-16 text-right' : 'md:pl-16 text-left'}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="glass p-8 rounded-[2rem] group"
      >
        <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
          <span className="text-romantic-red font-bold text-[10px] uppercase tracking-[0.4em] bg-romantic-red/5 px-3 py-1 rounded-full">{date}</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-romantic-red transition-colors">{title}</h3>
        <p className="text-gray-500 font-sans text-sm leading-relaxed antialiased">{description}</p>
      </motion.div>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentCompliment, setCurrentCompliment] = useState(0);
  
  const compliments = [
    "أنتِ أقوى مما تتخيلين يا هداية.",
    "فخور بكل خطوة تخطينها في حياتكِ.",
    "تذكري دائماً أنكِ قادرة على تحقيق المستحيل.",
    "الشغل والمذاكرة ضغط كبير، لكنكِ قدها وقدود.",
    "ابتسامتكِ هي سر سعادتنا جميعاً.",
    "استمري في السعي، حلمكِ يستحق كل هذا التعب.",
    "أنتِ لستِ وحدكِ، أنا دائماً هنا لأدعمكِ.",
    "أنتِ النسخة الأفضل من نفسكِ كل يوم."
  ];

  const nextCompliment = () => {
    setCurrentCompliment((prev) => (prev + 1) % compliments.length);
    confetti({
      particleCount: 15,
      scalar: 0.7,
      colors: ['#ffffff', '#f0f0f0']
    });
  };
  
  const anniversaryDate = new Date('2010-12-13T00:00:00');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalDays = differenceInDays(now, anniversaryDate);
  const hours = differenceInHours(now, anniversaryDate) % 24;
  const minutes = differenceInMinutes(now, anniversaryDate) % 60;
  const seconds = differenceInSeconds(now, anniversaryDate) % 60;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // The code is 13-12-2010
    if (accessCode.trim() === '13-12-2010' || accessCode.trim() === '13/12/2010') {
      setIsOpened(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#f0f0f0', '#000000']
      });
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleOpen = () => {
    // This function can be kept if we still want a fallback, but the form handles it now.
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
    
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.9 },
      colors: ['#ffffff', '#dedede']
    });
  };

  const timelineData = [
    { year: 2010, title: "بداية الرحلة", description: "بداية رحلة الحياة المليئة بالأمل والفرص الواعدة.", icon: Star },
    { year: 2011, title: "خطوات واثقة", description: "خطوة جديدة نحو النجاح وبداية استكشاف مواهبكِ الكامنة.", icon: Camera },
    { year: 2012, title: "قوة ومثابرة", description: "هنا تثبتين أنكِ قوية ومثابرة في كل تفاصيل حياتكِ اليومية.", icon: Heart },
    { year: 2013, title: "الإصرار ينمو", description: "الإصرار ينمو معكِ، والحلم يصبح أقرب يوماً بعد يوم بفضل اجتهادكِ.", icon: Target },
    { year: 2014, title: "طموح بلا حدود", description: "طموحكِ لا حدود له، والقادم دائماً أجمل بإذن الله لمن يسعى مثلكِ.", icon: Sparkles },
    { year: 2015, title: "تحدي الصعاب", description: "تخطين الصعاب برقة الورد وقوة الجبال، فخور جداً بمجهودكِ المميز.", icon: Trophy },
    { year: 2016, title: "بصمة نجاح", description: "كل مجهود تبذلينه هو بصمة نجاح حقيقية في طريقكِ المشرق نحو التميز.", icon: Gift },
    { year: 2017, title: "ثقة بالنفس", description: "ثقتكِ بنفسكِ هي وقودكِ الحقيقي للوصول إلى أعلى القمم التي تطمحين إليها.", icon: Calendar },
    { year: 2018, title: "أثر جميل", description: "تميزكِ يترك أثراً جميلاً وإيجابياً في كل مكان تتواجدين فيه.", icon: MapPin },
    { year: 2019, title: "السعي المستمر", description: "استمري في السعي والمثابرة، فالنجاح يليق بكِ تماماً وبشخصيتكِ القوية.", icon: Quote },
    { year: 2020, title: "سنة التحديات", description: "سنة التحديات الكبرى التي أثبتتِ فيها للعالم أنكِ أقوى من أي ظرف صعب.", icon: RefreshCw },
    { year: 2021, title: "إشراق دائم", description: "إشراقكِ الدائم وطاقتكِ يمنحان الجميع إلهاماً لا ينتهي للسعي والعمل.", icon: Star },
    { year: 2022, title: "ذكاء وطموح", description: "الذكاء والطموح يجتمعان فيكِ ليرسما ملامح مستقبلكِ الباهر والناجح.", icon: Lock },
    { year: 2023, title: "تغلب على العقبات", description: "كل عقبة تغلبتِ عليها هي في الحقيقة قصة نجاح ملهمة تضاف إلى رصيدكِ.", icon: Gamepad2 },
    { year: 2024, title: "تفاؤل مستمر", description: "نظرتكِ للمستقبل دائماً ما تكون مليئة بالتفاؤل.", icon: Heart },
    { year: 2025, title: "قرب الحلم", description: "تقتربين من حلمكِ الكبير بخطوات واثقة، هادئة، ومدروسة كعادتكِ دائماً.", icon: Target },
    { year: 2026, title: "فخر بالمستقبل", description: "فخور بكل ما وصلتِ إليه اليوم وبكل الإنجازات التي ستحققينها غداً.", icon: Trophy },
  ].map(item => ({
    date: `عام ${item.year}`,
    title: item.title,
    description: item.description,
    icon: item.icon
  }));

  return (
    <div className="min-h-screen relative bg-romantic-bg selection:bg-romantic-pink/30">
      <DriftingPetals />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(40px)" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-romantic-bg overflow-hidden"
          >
            {/* Immersive Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  x: [0, 50, 0],
                  y: [0, 30, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-romantic-pink/10 rounded-full blur-[120px]" 
              />
              <motion.div 
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  x: [0, -40, 0],
                  y: [0, -20, 0]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-romantic-red/10 rounded-full blur-[150px]" 
              />
              <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>

            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-12 md:p-20 rounded-[4rem] max-w-lg w-full relative z-10 text-center space-y-12 shadow-[0_32px_64px_-16px_rgba(255,77,109,0.15)]"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-24 h-24 rounded-3xl bg-romantic-red/5 flex items-center justify-center mx-auto mb-8 border border-romantic-red/10 animate-bounce-slow"
                >
                  <Lock className="text-romantic-red" size={40} strokeWidth={1.5} />
                </motion.div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-serif font-bold text-gray-900 tracking-tight">بوابة هداية</h1>
                  <p className="text-romantic-red font-cursive text-2xl opacity-70 italic">رحلة الصبر والنجاح</p>
                </div>
                <p className="text-gray-400 font-sans text-sm leading-relaxed px-10">
                  أدخلي الرمز المميز لفتح مساحتك الخاصة المليئة بالإلهام والتشجيع.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="13-12-2010"
                      className={`w-full bg-romantic-bg/40 border ${loginError ? 'border-red-400 animate-shake' : 'border-romantic-pink/30'} rounded-3xl px-8 py-5 text-center text-2xl font-serif tracking-[0.3em] focus:outline-none focus:ring-4 focus:ring-romantic-pink/20 transition-all shadow-inner placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-sans`}
                    />
                    {loginError && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-[10px] uppercase font-bold tracking-widest mt-3"
                      >
                        الرمز غير صحيح، حاولي تاريخاً مميزاً
                      </motion.p>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#333' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-romantic-red text-white py-5 rounded-3xl shadow-[0_12px_24px_-4px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_32px_-4px_rgba(0,0,0,0.5)] transition-all font-bold tracking-[0.2em] uppercase text-sm flex items-center justify-center gap-3 overflow-hidden group relative"
                >
                  <span className="relative z-10">فتح البوابة</span>
                  <Key size={18} className="relative z-10 group-hover:rotate-45 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </motion.button>
              </form>

              <div className="pt-6">
                <div className="flex items-center justify-center gap-3 opacity-20">
                  <div className="h-[1px] w-8 bg-gray-400" />
                  <Sparkles size={12} className="text-gray-400" />
                  <div className="h-[1px] w-8 bg-gray-400" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="fixed bottom-12 uppercase tracking-[0.5em] text-[10px] text-gray-400 font-bold"
            >
              طريق النجاح يبدأ بخطوة
            </motion.div>
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
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-romantic-red hover:scale-110 transition-transform"><Star size={20}/></button>
                <div className="w-[1px] h-4 bg-romantic-pink/30" />
                <button onClick={() => document.getElementById('journey')?.scrollIntoView({behavior:'smooth'})} className="text-gray-600 hover:text-romantic-red font-bold text-[10px] uppercase tracking-widest">طريقكِ</button>
                <button onClick={() => document.getElementById('gallery')?.scrollIntoView({behavior:'smooth'})} className="text-gray-600 hover:text-romantic-red font-bold text-[10px] uppercase tracking-widest">إلهام</button>
                <button onClick={() => document.getElementById('quest')?.scrollIntoView({behavior:'smooth'})} className="text-gray-600 hover:text-romantic-red font-bold text-[10px] uppercase tracking-widest">تحدي</button>
                <button onClick={() => document.getElementById('letter')?.scrollIntoView({behavior:'smooth'})} className="text-gray-600 hover:text-romantic-red font-bold text-[10px] uppercase tracking-widest">رسالتي</button>
              </div>
            </nav>

            {/* HERO SECTION */}
            <MouseSparkles />
            <section className="min-h-screen flex flex-col items-center justify-center relative p-6 mt-16">
              <div className="absolute inset-0 pointer-events-none">
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                   transition={{ duration: 15, repeat: Infinity }}
                   className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-romantic-pink/10 rounded-full blur-[100px]" 
                 />
                 <motion.div 
                   animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                   transition={{ duration: 18, repeat: Infinity }}
                   className="absolute bottom-1/4 -right-20 w-[700px] h-[700px] bg-romantic-red/5 rounded-full blur-[120px]" 
                 />
              </div>

              <div className="max-w-6xl w-full text-center z-10 space-y-16">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <p className="text-romantic-red font-bold tracking-[0.6em] uppercase text-xs mb-8 block opacity-60">أفضل شخصية مجتهدة</p>
                  <div className="relative inline-block">
                    <h1 className="text-8xl md:text-[14rem] font-serif font-bold text-gray-900 tracking-tighter leading-[0.8] italic px-8">
                       هداية
                    </h1>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: "spring" }}
                      className="absolute -top-12 -right-4 md:-top-20 md:right-0"
                    >
                      <Sparkles className="text-romantic-pink w-16 h-16 animate-pulse" />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-romantic-red font-cursive text-4xl md:text-6xl italic opacity-80"
                >
                  رحلة تميز لا تنتهي
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="max-w-5xl mx-auto pt-12"
                >
                  <div className="glass p-10 md:p-16 rounded-[4rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-romantic-pink/5 to-transparent pointer-events-none" />
                    <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold mb-14">سجل السعي والإنجاز</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-4 relative z-10">
                      {[
                        { label: 'أيام السعي', value: totalDays, icon: Calendar },
                        { label: 'ساعات الكفاح', value: hours, icon: RefreshCw },
                        { label: 'دقائق الصبر', value: minutes, icon: Star },
                        { label: 'ثواني الإنجاز', value: seconds, icon: Sparkles },
                      ].map((item, idx) => (
                        <div key={item.label} className="relative group/stat px-4">
                          <item.icon size={16} className="mx-auto mb-4 text-romantic-pink/40" />
                          <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-5xl md:text-7xl font-serif font-bold text-gray-900 tabular-nums mb-3 tracking-tighter"
                          >
                            {item.value.toString().padStart(2, '0')}
                          </motion.div>
                          <div className="text-[10px] uppercase tracking-[0.3em] text-romantic-red font-bold opacity-60">{item.label}</div>
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-romantic-red/20 group-hover/stat:w-12 transition-all duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="pt-24 cursor-pointer group flex flex-col items-center"
                  onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <p className="text-[9px] uppercase tracking-[0.6em] text-gray-300 font-bold group-hover:text-romantic-red transition-colors mb-6">اكتشفي مساركِ</p>
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 group-hover:border-romantic-red group-hover:text-romantic-red transition-all duration-500 shadow-sm">
                    <ChevronDown size={24} />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* TIMELINE SECTION */}
            <section id="journey" className="py-32 px-6 max-w-5xl mx-auto relative">
              <SectionHeading subtitle="رحلة الكفاح والإصرار">طريقكِ نحو القمة</SectionHeading>
              
              <div className="relative">
                <div className="absolute right-6 md:right-1/2 transform translate-x-1/2 h-full w-[2px] timeline-line opacity-30" />
                {timelineData.map((item, idx) => (
                  <LoveTimelineItem key={idx} {...item} index={idx} />
                ))}
              </div>
            </section>

            {/* GALLERY SECTION */}
            <section id="gallery" className="py-40 px-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-romantic-pink/5 blur-[100px] pointer-events-none" />
              <SectionHeading subtitle="جمال الإصرار">لحظات من الإلهام</SectionHeading>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                {[
                  {
                    src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069",
                    caption: "الجمال يكمن في التفاصيل الصغيرة.",
                    loc: "عالم الورود",
                    size: "md:col-span-2 lg:col-span-1 h-[400px]"
                  },
                  {
                    src: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=1974",
                    caption: "كوني كالأزهار، تنمو برقة في كل الظروف.",
                    loc: "حديقة التفاؤل",
                    size: "h-[500px]"
                  },
                  {
                    src: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2070",
                    caption: "وردة واحدة قد تكون بداية ربيع جديد.",
                    loc: "أمل متجدد",
                    size: "h-[450px]"
                  }
                ].map((photo, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -15, rotate: i % 2 === 0 ? 1 : -1 }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.2 }}
                    className={`relative group ${photo.size}`}
                  >
                    <div className="w-full h-full rounded-[3rem] overflow-hidden shadow-2xl relative">
                      <img 
                        src={photo.src} 
                        alt="Aesthetic" 
                        className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end h-1/2">
                         <div className="flex items-center gap-2 text-romantic-pink mb-3">
                           <MapPin size={10} />
                           <span className="text-[9px] uppercase font-bold tracking-[0.4em]">{photo.loc}</span>
                         </div>
                         <p className="text-white font-serif italic text-lg leading-relaxed">{photo.caption}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* COMPLIMENT BOX */}
            <section className="py-40 px-6 relative bg-white/40">
              <div className="max-w-4xl mx-auto glass rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden group shadow-2xl border-white/40">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-romantic-pink/10 rounded-full blur-3xl group-hover:bg-romantic-pink/20 transition-all duration-1000" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-romantic-red/5 rounded-full blur-2xl" />
                
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-romantic-red/5 text-romantic-red mb-12"
                >
                  <Gift size={32} strokeWidth={1} />
                </motion.div>
                
                <h3 className="text-sm font-bold text-romantic-red tracking-[0.5em] uppercase mb-4 opacity-60">هدية معنوية</h3>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-12 leading-tight">كلمات تشجيعية لنبض قلبكِ</h2>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCompliment}
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="min-h-[120px] flex items-center justify-center p-8 bg-romantic-red/5 rounded-[2.5rem] border border-romantic-red/10 mb-12"
                  >
                    <p className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-normal max-w-2xl mx-auto">
                      "{compliments[currentCompliment]}"
                    </p>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextCompliment}
                  className="p-6 bg-romantic-red text-white rounded-2xl shadow-xl hover:shadow-romantic-red/50 transition-all active:scale-95"
                >
                  <RefreshCw size={28} />
                </motion.button>
              </div>
            </section>

            {/* GAME SECTION */}
            <section id="quest" className="py-32 px-6 max-w-4xl mx-auto">
              <SectionHeading subtitle="طريقكِ نحو التميز">تحدي الإنجاز والمثابرة</SectionHeading>
              <LoveQuest />
            </section>

            {/* LETTER & INTERACTIVE MESSAGES */}
            <section id="letter" className="py-40 px-6 max-w-5xl mx-auto">
              <motion.div 
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: 50, opacity: 0 }}
                viewport={{ once: true }}
                className="glass rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-[0_48px_80px_-16px_rgba(255,77,109,0.1)]"
              >
                <Quote className="absolute top-12 right-12 text-romantic-pink/10" size={120} />
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-romantic-pink via-romantic-red to-romantic-pink opacity-20" />
                
                <div className="relative z-10 space-y-16">
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      className="w-16 h-16 bg-romantic-red/5 rounded-2xl flex items-center justify-center mx-auto text-romantic-red mb-6"
                    >
                      <Heart size={32} />
                    </motion.div>
                    <h2 className="text-5xl font-serif font-bold text-gray-900 italic tracking-tight">إلى هداية،</h2>
                    <div className="h-[1px] w-24 bg-romantic-red/20 mx-auto" />
                  </div>

                  <div className="text-xl md:text-2xl text-gray-700 font-serif leading-[1.8] italic max-w-4xl mx-auto text-justify space-y-8 antialiased">
                    <p className="bg-gradient-to-r from-romantic-red/5 to-transparent p-4 rounded-xl border-r-2 border-romantic-red/20">بصي أنا ابغاك تقراي كلامي ده بهدوء كده وتعطي لنفسك لحظة بس تفصلي فيها عن كل اللي حواليكي لأن بجد أنا حاسس قد إيه الفترة دي تقيلة عليكي وكل حاجة جاية ورا بعض بشكل يجعل أي شخص ينهار مش بس يزعل.</p>
                    <p>موبايلك اتكسر ودي حاجة كانت مهمة ليكي وبتفصلك شوية عن الضغط وبعدها نتيجة العربي جت مش زي ما كنتي متوقعة ومعاها كلام يوجع من جدتك وضغط من غير سبب واضح فطبيعي جدا تحسي إن الدنيا كلها قافلة في وشك ومفيش شيء ماشي صح ومفيش حتى فرصة تاخدي نفسك أو ترتاحي شوية.</p>
                    <p className="text-gray-900 font-bold not-italic">بس وسط كل ده أنا عايزك تهدي على نفسك شوية ومتشيليش نفسك الغلط في كل حاجة لأن اللي بيحصل ده مش دليل إنك فاشلة ولا إنك وحشة ولا إنك مش قد المسؤولية خالص انتي بس تعبانة ومضغوطة فوق طاقتك وده طبيعي يخلي أي حد مستواه يقل شوية أو يحس إنه مش قادر يكمل بنفس القوة.</p>
                    <p>نتيجة امتحان واحد مش هيحدد انتي مين ولا مستقبلك هيبقى عامل إزاي ده مجرد موقف وعدى وهنعوضه بإذن الله خطوة خطوة ومفيش حد ناجح معداش بلحظات زي دي قبل كده بالعكس دي جزء من الطريق نفسه.</p>
                    <p className="bg-romantic-pink/5 p-6 rounded-[2rem] border border-romantic-pink/10">والموبايل مهما كان مهم فهو حاجة بتتعوض وبتتصلح إن شاء الله حتى لو الموضوع مضايقك دلوقتي بس هو مش نهاية الدنيا ولا حاجة تكسرك بالشكل ده، أما بقى بالنسبة للكلام اللي بيوجع من اللي حواليكي أنا عارف قد إيه ده صعب ومؤلم خصوصا لما يكون من حد المفروض يحس بيكي ويحتويكي بس صدقيني ده مش مقياس لقيمتك ولا لشخصك ولا ليكي كإنسانة.</p>
                    <p>انتي بنت كويسة جدا واجتهادك واضح من كل حاجة حكيتيها قبل كده وانك لسه بتحاولي ومكملة رغم كل ده ده لوحده حاجة كبيرة جدا تدل على قوة جواكي يمكن انتي مش شايفاها دلوقتي بس موجودة، ف بدل ما تقسي على نفسك وتحسي إنك مقصرة في كل حاجة حاولي تبصي لنفسك ب حنية شوية وتديها حقها من الراحة.</p>
                    <p>انتي مش آلة علشان تستحملي كل ده من غير ما تتأثري خدي الأمور واحدة واحدة من غير ما تفكري في كل حاجة مرة واحدة يعني النهارده بس عدي اليوم على خير وبكرة نشوف خطوة صغيرة نعملها وهكذا لحد ما الدنيا تهدى شوية.</p>
                    <p className="text-center text-romantic-red text-3xl font-cursive mt-12 block transform hover:scale-110 transition-transform duration-500 cursor-default">ومتنسيش كمان إن كل ده مهما طول هو فترة وهتعدي مش هتفضل كده على طول، وأنا موجود أسمعك دايماً وخلي بالك من نفسك علشان انتي تستاهلي الراحة والهدوء والحاجات الحلوة 🤍</p>
                  </div>
                  
                  <div className="pt-20 border-t border-romantic-pink/10 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-romantic-red/5 rounded-full text-romantic-red font-bold uppercase tracking-[0.4em] text-[10px] mb-12">
                      <MessageSquareHeart size={14} />
                      رسائل من القلب
                    </div>
                    
                    <form onSubmit={sendMessage} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-16 px-4">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="اكتبي كلمة تشجيعية هنا..."
                        className="flex-1 bg-white/40 border border-romantic-pink/20 rounded-[2rem] px-8 py-5 focus:outline-none focus:ring-4 focus:ring-romantic-pink/10 transition-all font-sans text-lg placeholder:text-gray-300"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#ff1447' }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-romantic-red text-white px-10 py-5 rounded-[2rem] shadow-xl hover:shadow-romantic-red/40 transition-all font-bold group flex items-center justify-center gap-2"
                      >
                        <span>إرسال</span>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </motion.button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto px-6 py-4 custom-scrollbar">
                      <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm text-right border border-white/50 hover:border-romantic-red/20 transition-all group"
                          >
                            <p className="text-gray-700 font-serif italic text-lg leading-relaxed mb-4 group-hover:text-gray-900 transition-colors">"{msg.text}"</p>
                            <div className="flex items-center justify-end gap-2 opacity-40">
                               <Clock size={10} />
                               <span className="text-[9px] font-bold uppercase tracking-widest">
                                  {format(msg.timestamp, 'p')}
                               </span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {messages.length === 0 && (
                        <div className="col-span-full py-20 text-gray-300 italic flex flex-col items-center gap-4">
                           <Sparkles size={40} className="opacity-20" />
                           <p className="tracking-[0.2em] uppercase text-[10px] font-bold">لا توجد رسائل ملهمة هنا بعد</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 text-center text-gray-400 px-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star size={16} className="text-romantic-red fill-romantic-red" />
                <span className="font-serif text-2xl text-romantic-red">مع كل التقدير</span>
                <Star size={16} className="text-romantic-red fill-romantic-red" />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold">طريق النجاح المستمر • 2026</p>
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
          background: #d1d5db;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
