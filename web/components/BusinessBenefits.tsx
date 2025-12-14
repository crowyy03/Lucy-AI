import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Zap, BarChart3, ShieldCheck, Coffee, ChevronDown } from 'lucide-react';

const stats = [
  {
    label: "Мультизадачность",
    value: "1 = ∞",
    desc: "Один ИИ заменяет расширение штата. Lucy обрабатывает 5, 10 или 50 звонков одновременно без очередей.",
    icon: <Users className="w-6 h-6 text-lavender" />
  },
  {
    label: "Обработка лидов",
    value: "100%",
    desc: "Ни одного пропущенного звонка. Линия всегда свободна, даже если звонят все клиенты разом.",
    icon: <TrendingUp className="w-6 h-6 text-green-400" />
  },
  {
    label: "Работает всегда",
    value: "24/7",
    desc: "Запись клиентов ночью, в выходные и праздники. Пока конкуренты спят, вы наполняете расписание.",
    icon: <Zap className="w-6 h-6 text-yellow-400" />
  },
  {
    label: "Сервис в зале",
    value: "Focus",
    desc: "Администратор не висит на телефоне, а уделяет внимание гостям: варит кофе и встречает с улыбкой.",
    icon: <Coffee className="w-6 h-6 text-orange-300" />
  },
  {
    label: "Человеческий фактор",
    value: "0%",
    desc: "ИИ не болеет, не выгорает, не хамит и всегда следует скрипту продаж слово в слово.",
    icon: <ShieldCheck className="w-6 h-6 text-blue-400" />
  },
  {
    label: "Аналитика",
    value: "CRM",
    desc: "Полная транскрибация диалогов, авто-тегирование и мгновенное попадание заявки в вашу систему.",
    icon: <BarChart3 className="w-6 h-6 text-olive-light" />
  }
];

export const BusinessBenefits: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (!isMobile) return;
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-20 relative bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Математика выгоды
          </h2>
          <p className="text-zinc-500">
            Эффективность, которую невозможно получить при найме людей.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                onClick={() => handleCardClick(idx)}
                className={`
                   bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 
                   p-4 md:p-8 rounded-2xl md:rounded-3xl relative group overflow-hidden transition-all duration-300
                   ${isExpanded ? 'z-20 scale-[1.02] border-lavender/30 shadow-2xl' : ''}
                   ${isMobile ? 'cursor-pointer' : ''}
                `}
              >
                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity transform md:group-hover:scale-110 duration-500">
                    {stat.icon}
                </div>
                
                <div className="relative z-10">
                  <div className="text-xl md:text-5xl font-bold text-white mb-1 md:mb-2 tracking-tight">
                      {stat.value}
                  </div>
                  <h3 className="text-[11px] md:text-lg font-medium text-lavender mb-2 md:mb-4 leading-tight">{stat.label}</h3>
                  
                  {/* Desktop Description */}
                  <p className="hidden md:block text-sm text-zinc-500 leading-relaxed border-t border-zinc-800 pt-4">
                      {stat.desc}
                  </p>

                  {/* Mobile Description (Expandable) */}
                  <div className="md:hidden">
                       <AnimatePresence>
                         {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <p className="text-[10px] text-zinc-400 leading-relaxed border-t border-zinc-800 pt-2 mt-1">
                                    {stat.desc}
                                </p>
                            </motion.div>
                         )}
                       </AnimatePresence>
                       {!isExpanded && (
                           <div className="mt-1 opacity-20 flex justify-start">
                               <ChevronDown size={12} />
                           </div>
                       )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Block */}
        <div className="mt-12 rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">Хотите индивидуальный расчет?</h3>
                <p className="text-zinc-500 text-sm">Мы проанализируем ваш поток звонков и покажем точки роста.</p>
            </div>
            <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="whitespace-nowrap bg-white text-zinc-900 px-8 py-3 rounded-full font-bold hover:bg-lavender transition-colors"
            >
                Получить расчет
            </button>
        </div>

      </div>
    </section>
  );
};