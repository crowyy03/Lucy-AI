import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Stethoscope, Sparkles, User, Play, Pause, ArrowRight, AlertCircle } from 'lucide-react';

const scenarios = [
  {
    id: 'beauty',
    label: 'Салон красоты',
    icon: <Sparkles />,
    desc: 'Запись на сложный окрас, консультация по мастерам.',
    benefits: ['Увеличение среднего чека за счет доп. услуг', 'Снижение неявки на 30%', 'Запись ночью'],
    audioSrc: '/audio/beauty.mp3', 
    dialogue: [
      { role: 'client', text: "Здравствуйте, хочу записаться на сложное окрашивание." },
      { role: 'lucy', text: "Добрый день! Отличный выбор. У нас есть топ-мастер Анна, она специализируется на AirTouch. Ближайшее окно в четверг в 14:00. Подойдет?" },
      { role: 'client', text: "А сколько это займет времени?" },
      { role: 'lucy', text: "Обычно это занимает около 4 часов. Мы подадим вам вкусный кофе. Записываем на четверг?" }
    ]
  },
  {
    id: 'dentist',
    label: 'Стоматология',
    icon: <User />,
    desc: 'Острая боль, перенос приема, напоминание о чистке.',
    benefits: ['Заполнение "окон" в расписании', 'Мгновенная реакция на острую боль', 'Напоминания'],
    audioSrc: '/audio/dentist.mp3',
    dialogue: [
      { role: 'client', text: "У меня выпала пломба, болит зуб." },
      { role: 'lucy', text: "Понимаю, это неприятно. Нужно действовать быстро. У доктора Иванова освободилось окно через 40 минут. Вы сможете подъехать?" },
      { role: 'client', text: "Да, выезжаю." },
      { role: 'lucy', text: "Забронировала время. Адрес помните? Ленина 45, вход со двора." }
    ]
  },
  {
    id: 'barber',
    label: 'Барбершоп',
    icon: <Scissors />,
    desc: 'Быстрая запись, выбор услуги, парковка.',
    benefits: ['Быстрая запись за 30 секунд', 'Снижение ФОТ на администраторов', 'Молодежный стиль общения'],
    audioSrc: '/audio/barber.mp3',
    dialogue: [
      { role: 'client', text: "Салют, есть место на стрижку бороды сегодня?" },
      { role: 'lucy', text: "Привет! Да, к Алексу есть место в 19:30. Успеваешь после работы?" },
      { role: 'client', text: "Да, супер. А парковка есть у вас?" },
      { role: 'lucy', text: "Конечно, за шлагбаумом для клиентов бесплатно. Скину код в SMS. Ждем в 19:30!" }
    ]
  },
  {
    id: 'clinic',
    label: 'Клиника',
    icon: <Stethoscope />,
    desc: 'Запись к узкому специалисту, уточнение анализов.',
    benefits: ['Обработка 1000+ звонков в день', 'Сортировка по специалистам', 'Конфиденциальность'],
    audioSrc: '/audio/clinic.mp3',
    dialogue: [
      { role: 'client', text: "Мне нужно к кардиологу и сразу сделать ЭКГ." },
      { role: 'lucy', text: "Хорошо. Комплексный прием ведет доктор Петрова. Ближайшее время — завтра в 09:00. ЭКГ сделают прямо в кабинете." },
      { role: 'client', text: "Сколько стоит прием?" },
      { role: 'lucy', text: "Первичный прием с ЭКГ стоит 3500₽. Записать вас?" }
    ]
  }
];

// Helper Hook for responsiveness
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

export const Showcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setIsPlaying(false);
    setAudioError(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (audioError) {
        return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
          playPromise.catch(error => {
              // Silently handle error, state is updated via onError
              setIsPlaying(false);
          });
      }
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Reset play state when tab changes
    setIsPlaying(false);
  }, [activeTab]);

  const ChatInterface = ({ scenario }: { scenario: typeof scenarios[0] }) => (
     <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl flex flex-col mt-4 lg:mt-0"
     >
        {/* Header */}
        <div className="bg-zinc-900/80 p-4 md:p-6 border-b border-white/5 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
           <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-lavender to-petrol flex items-center justify-center text-zinc-900 shadow-lg relative shrink-0">
                {isPlaying && <div className="absolute inset-0 rounded-full animate-ping bg-lavender/30" />}
                <User size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm md:text-lg">{scenario.label}</h3>
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 ${isPlaying ? 'animate-pulse' : ''}`}/> 
                    <span className="text-[10px] md:text-xs text-zinc-400 uppercase tracking-wider">
                        {isPlaying ? 'Идет звонок...' : 'Online'}
                    </span>
                </div>
              </div>
           </div>

           <button 
             onClick={(e) => { 
                e.stopPropagation(); 
                if (audioError) {
                    alert(`Не удалось загрузить аудиофайл: ${scenario.audioSrc}\n\nУбедитесь, что файл существует в папке public/audio вашего проекта.`);
                    return;
                }
                togglePlay(); 
             }}
             className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-full transition-all duration-300 font-medium text-xs md:text-sm border ${
                isPlaying 
                    ? 'bg-petrol text-white border-petrol hover:bg-petrol-light' 
                    : audioError 
                        ? 'bg-red-900/20 text-red-400 border-red-900/50 cursor-help'
                        : 'bg-white text-zinc-900 border-white hover:bg-lavender hover:border-lavender'
             }`}
           >
               {audioError ? (
                   <>
                    <AlertCircle size={14} />
                    <span>Ошибка</span>
                   </>
               ) : (
                   <>
                    {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                    <span>{isPlaying ? 'Пауза' : 'Слушать'}</span>
                   </>
               )}
           </button>
        </div>

        {/* Benefits Section */}
        <div className="bg-petrol-dim/20 px-4 py-3 border-b border-white/5 flex flex-wrap gap-2">
            {scenario.benefits.map((benefit, i) => (
                <span key={i} className="text-[10px] md:text-xs text-lavender bg-lavender/10 px-2 py-1 rounded border border-lavender/20">
                    {benefit}
                </span>
            ))}
        </div>

        {/* Body */}
        <div className="p-4 md:p-8 space-y-4 md:space-y-6 relative min-h-[300px] md:min-h-[400px] max-h-[500px] overflow-y-auto bg-zinc-900/20">
           {scenario.dialogue.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`flex ${msg.role === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 md:p-5 rounded-2xl text-sm md:text-base shadow-lg relative leading-snug ${
                  msg.role === 'client' 
                    ? 'bg-[#1E1E1E] text-zinc-200 rounded-br-none border border-zinc-800' 
                    : 'bg-gradient-to-br from-petrol-dark to-[#1F2C31] text-white border border-petrol/30 rounded-bl-none'
                }`}>
                   <div className="mb-1 opacity-50 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
                       {msg.role === 'client' ? 'Клиент' : 'Lucy AI'}
                   </div>
                   {msg.text}
                </div>
              </motion.div>
            ))}
        </div>
     </motion.div>
  );

  return (
    <section id="cases" className="py-16 md:py-24 relative overflow-hidden">
      <audio 
        key={scenarios[activeTab].id}
        ref={audioRef} 
        src={scenarios[activeTab].audioSrc} 
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
            // Silenced console.error to avoid spamming the console
            setAudioError(true);
            setIsPlaying(false);
        }}
      />
      
      {/* Background Blobs */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-petrol/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-lavender/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12 lg:mb-0 lg:w-[40%] inline-block"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Понимает любой контекст
          </h2>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
            Прослушайте реальные диалоги. Lucy знает терминологию и умеет работать с возражениями.
          </p>
        </motion.div>

        {isMobile ? (
            // MOBILE: Accordion Layout
            <div className="flex flex-col gap-4">
                {scenarios.map((scenario, idx) => (
                    <div key={scenario.id} className="w-full">
                        <button
                          onClick={() => handleTabChange(idx)}
                          className={`w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border text-left ${
                            activeTab === idx 
                              ? 'bg-white/10 border-lavender/30' 
                              : 'bg-zinc-900/50 border-white/5 hover:bg-white/5'
                          }`}
                        >
                          <div className={`p-3 rounded-xl transition-colors ${activeTab === idx ? 'bg-lavender text-zinc-900' : 'bg-zinc-800 text-zinc-500'}`}>
                            {scenario.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold ${activeTab === idx ? 'text-white' : 'text-zinc-400'}`}>
                              {scenario.label}
                            </h4>
                          </div>
                          <div className={`transition-transform duration-300 ${activeTab === idx ? 'rotate-90' : ''}`}>
                              <ArrowRight size={16} className="text-zinc-500" />
                          </div>
                        </button>
                        
                        <AnimatePresence>
                            {activeTab === idx && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <ChatInterface scenario={scenario} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        ) : (
            // DESKTOP: Two Columns
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
                <div className="lg:col-span-5 flex flex-col gap-3">
                  {scenarios.map((scenario, idx) => (
                    <button
                      key={scenario.id}
                      onClick={() => handleTabChange(idx)}
                      className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border text-left ${
                        activeTab === idx 
                          ? 'bg-white/10 border-lavender/30' 
                          : 'bg-transparent border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-3 rounded-xl transition-colors ${activeTab === idx ? 'bg-lavender text-zinc-900' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                        {scenario.icon}
                      </div>
                      <div>
                        <h4 className={`font-bold ${activeTab === idx ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                          {scenario.label}
                        </h4>
                        <p className="text-xs text-zinc-500 max-w-[200px] hidden sm:block">{scenario.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-7">
                     <AnimatePresence mode="wait">
                         <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                         >
                            <ChatInterface scenario={scenarios[activeTab]} />
                         </motion.div>
                     </AnimatePresence>
                </div>
            </div>
        )}
      </div>
    </section>
  );
};