import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Zap, Layers, Globe, Shield, Smartphone, ChevronDown } from 'lucide-react';

const featuresList = [
  {
    icon: <Mic className="w-6 h-6 text-lavender" />,
    title: "Естественная речь",
    description: "Благодаря современным LLM, Lucy говорит так же естественно, как человек, понимает контекст и перебивания."
  },
  {
    icon: <Zap className="w-6 h-6 text-lavender" />,
    title: "Мгновенный ответ",
    description: "Задержка ответа менее 800мс. Клиент не чувствует, что разговаривает с роботом."
  },
  {
    icon: <Layers className="w-6 h-6 text-lavender" />,
    title: "Интеграции",
    description: "Подключаемся к YClients, AmoCRM, Bitrix24 и Google Calendar. Запись попадает в график мгновенно."
  },
  {
    icon: <Globe className="w-6 h-6 text-lavender" />,
    title: "Работа 24/7",
    description: "Lucy не спит, не ест и не уходит в отпуск. Она обрабатывает звонки круглосуточно."
  },
  {
    icon: <Shield className="w-6 h-6 text-lavender" />,
    title: "Безопасность",
    description: "Все данные шифруются. Мы подписываем NDA и гарантируем конфиденциальность базы клиентов."
  },
  {
    icon: <Smartphone className="w-6 h-6 text-lavender" />,
    title: "Работа везде",
    description: "Принимаем звонки с мобильных, городских номеров и мессенджеров (Telegram, WhatsApp)."
  }
];

export const Features: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (!isMobile) return;
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="features" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: isMobile ? "-10%" : "-20%" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Возможности платформы</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Технологии, которые превращают обычную телефонию в мощный инструмент продаж.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {featuresList.map((feature, index) => {
            const isExpanded = expandedIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: isMobile ? "0px" : "-50px" }}
                transition={{ delay: isMobile ? 0 : index * 0.1, duration: 0.5 }}
                onClick={() => handleCardClick(index)}
                className={`
                  relative p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 
                  hover:border-lavender/30 transition-all duration-300 group 
                  flex flex-col items-center text-center md:items-start md:text-left
                  ${isExpanded ? 'bg-white/10 z-20 scale-[1.02] shadow-xl' : ''}
                  ${isMobile ? 'cursor-pointer active:scale-95' : ''}
                `}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-3 md:mb-4 md:group-hover:scale-110 transition-transform">
                  <div className="scale-90 md:scale-100">
                      {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-sm md:text-xl font-bold text-white mb-2 leading-tight w-full">
                    {feature.title}
                </h3>
                
                {/* Desktop Description (Always Visible) */}
                <p className="text-zinc-400 text-sm leading-relaxed hidden md:block">
                  {feature.description}
                </p>

                {/* Mobile Description (Expandable) */}
                <div className="md:hidden w-full">
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <p className="text-zinc-300 text-[11px] leading-snug pt-2 pb-1 border-t border-white/10 mt-2">
                                    {feature.description}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {!isExpanded && (
                       <div className="mt-2 flex justify-center opacity-30">
                           <ChevronDown size={14} className="animate-bounce" />
                       </div>
                    )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};