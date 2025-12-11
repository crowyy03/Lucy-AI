import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MessageCircle, CalendarCheck, ShieldCheck, DollarSign, TrendingUp, Mic, Brain, Zap } from 'lucide-react';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';

const features = [
  {
    id: 1,
    icon: <Clock className="text-lavender w-6 h-6 md:w-8 md:h-8" />,
    title: "Всегда онлайн",
    subtitle: "24/7 Доступность",
    desc: "Lucy никогда не спит. Она обрабатывает 100% входящих звонков, даже если их поступает 50 одновременно. Ни один клиент не услышит «занято»."
  },
  {
    id: 2,
    icon: <Brain className="text-petrol-light w-6 h-6 md:w-8 md:h-8" />,
    title: "Эмпатия",
    subtitle: "Понимает эмоции",
    desc: "Наш AI различает эмоции клиента. Если клиент раздражен, Lucy успокоит. Если спешит — ускорит запись. Она помнит контекст предыдущих разговоров."
  },
  {
    id: 3,
    icon: <CalendarCheck className="text-lavender w-6 h-6 md:w-8 md:h-8" />,
    title: "Запись в CRM",
    subtitle: "YClients / Amo",
    desc: "Глубокая интеграция с YClients, AmoCRM, Bitrix24. Lucy видит свободные слоты в реальном времени. Запись попадает в ваш календарь мгновенно."
  },
  {
    id: 4,
    icon: <ShieldCheck className="text-petrol-light w-6 h-6 md:w-8 md:h-8" />,
    title: "Без ошибок",
    subtitle: "Идеальный скрипт",
    desc: "Человеческий фактор исключен. Администратор не забудет перезвонить, не перепутает время и всегда предложит доп. услуги по скрипту."
  },
  {
    id: 5,
    icon: <DollarSign className="text-lavender w-6 h-6 md:w-8 md:h-8" />,
    title: "Выгода",
    subtitle: "Дешевле в 5 раз",
    desc: "Стоимость подписки в 5-10 раз ниже зарплаты администратора. Нет налогов, отпускных и больничных. Вы платите только за реальный результат."
  },
  {
    id: 6,
    icon: <TrendingUp className="text-petrol-light w-6 h-6 md:w-8 md:h-8" />,
    title: "Конверсия",
    subtitle: "Рост до 40%",
    desc: "Мгновенный ответ удерживает «горячих» клиентов. Прозвон потерянной базы возвращает старых. Lucy автоматически напоминает о визитах."
  },
  {
    id: 7,
    icon: <Mic className="text-lavender w-6 h-6 md:w-8 md:h-8" />,
    title: "Голос",
    subtitle: "Реализм 100%",
    desc: "Мы используем модели (Gemini/OpenAI), обученные на русском языке. Паузы, вдохи, «хм» и «ага» делают речь неотличимой от человека."
  },
  {
    id: 8,
    icon: <Zap className="text-petrol-light w-6 h-6 md:w-8 md:h-8" />,
    title: "Запуск",
    subtitle: "За 24 часа",
    desc: "Не нужно месяц обучать сотрудника. Мы настраиваем базу знаний вашего бизнеса за 1 день. Lucy готова к работе сразу после подключения."
  }
];

export const Features: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const isTouchDevice = useIsTouchDevice();

  // Helper for touch devices to toggle card expand
  const handleTouch = (id: number) => {
      setHoveredId(hoveredId === id ? null : id);
  }

  return (
    <section id="features" className="py-16 md:py-24 relative z-10 overflow-visible">
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-lavender font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 block">Технологическое превосходство</span>
          <h2 className="text-3xl md:text-7xl font-bold mb-6 text-white tracking-tighter">
            Больше, чем просто <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender via-white to-petrol-light">интеллект</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Lucy AI — это комплексная платформа коммуникации, которая заменяет целый отдел колл-центра, работая точнее, быстрее и дешевле.
          </p>
        </motion.div>

        {/* Changed grid-cols-1 to grid-cols-2 for mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              layout={!isTouchDevice}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: idx * 0.05, duration: isTouchDevice ? 0.35 : 0.5 }}
              onMouseEnter={!isTouchDevice ? () => setHoveredId(feature.id) : undefined}
              onMouseLeave={!isTouchDevice ? () => setHoveredId(null) : undefined}
              onClick={isTouchDevice ? () => handleTouch(feature.id) : undefined} // For mobile tap
              className={`relative cursor-pointer md:cursor-default overflow-hidden rounded-2xl md:rounded-3xl border transition-all ${isTouchDevice ? 'duration-300' : 'duration-500'} flex flex-col justify-start ${
                hoveredId === feature.id 
                  ? 'bg-zinc-900/90 border-lavender/40 shadow-[0_0_40px_rgba(216,180,254,0.15)] z-20 h-[280px] md:h-[320px]' 
                  : 'bg-white/[0.03] border-white/[0.05] h-[160px] md:h-[240px] hover:border-white/20'
              }`}
            >
              <div className="p-4 md:p-8 relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <div className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-colors duration-500 ${hoveredId === feature.id ? 'bg-lavender text-zinc-900' : 'bg-white/5 text-zinc-400'}`}>
                    {feature.icon}
                  </div>
                  <motion.div 
                     animate={{ rotate: hoveredId === feature.id ? 45 : 0, opacity: hoveredId === feature.id ? 1 : 0.3 }}
                     className="hidden md:block"
                  >
                     <div className="w-2 h-2 rounded-full bg-white" />
                  </motion.div>
                </div>

                <div>
                  <h3 className={`text-sm md:text-xl font-bold mb-1 transition-colors leading-tight ${hoveredId === feature.id ? 'text-white' : 'text-zinc-200'}`}>
                    {feature.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">{feature.subtitle}</p>
                </div>

                {/* Animated Description on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === feature.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-auto"
                >
                  <p className="text-zinc-300 text-[10px] md:text-sm leading-relaxed border-t border-white/10 pt-2 md:pt-4">
                    {feature.desc}
                  </p>
                </motion.div>
              </div>
              
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-b from-lavender/5 to-transparent transition-opacity duration-500 pointer-events-none ${hoveredId === feature.id ? 'opacity-100' : 'opacity-0'}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};