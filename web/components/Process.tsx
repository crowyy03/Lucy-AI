import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Анализ', text: 'Изучаем ваши скрипты, записи звонков и базу данных CRM.' },
  { num: '02', title: 'Сборка', text: 'Создаем цифровую копию вашего лучшего администратора.' },
  { num: '03', title: 'Интеграция', text: 'Подключаем телефонию и календарь записи (YClients/Amo).' },
  { num: '04', title: 'Тесты', text: 'Проводим 100+ тестовых звонков с разными сложными сценариями.' },
  { num: '05', title: 'Запуск', text: 'Lucy начинает принимать реальные звонки 24/7.' },
];

export const Process: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Процесс внедрения</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-base">
            Мы берем на себя всю техническую часть. От вас нужно только желание увеличить прибыль.
          </p>
        </motion.div>
        
        {/* DESKTOP LAYOUT (Horizontal) */}
        <div className="hidden md:block relative">
          <div className="absolute top-[40px] left-0 w-full h-[2px] bg-zinc-800 z-0 rounded-full overflow-hidden">
             <motion.div 
               initial={{ x: '-100%' }}
               whileInView={{ x: '100%' }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="w-1/2 h-full bg-gradient-to-r from-transparent via-lavender to-transparent"
             />
          </div>

          <div className="grid grid-cols-5 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="relative group pt-4"
              >
                <div className="w-20 h-20 rounded-full bg-dark-bg border-2 border-zinc-800 group-hover:border-lavender group-hover:shadow-[0_0_30px_rgba(216,180,254,0.4)] text-zinc-500 group-hover:text-white flex items-center justify-center text-xl font-bold mb-8 mx-auto transition-all duration-300 z-10 relative">
                  {step.num}
                  <div className="absolute inset-0 rounded-full bg-lavender opacity-0 group-hover:opacity-10 transition-opacity" />
                </div>
                
                <div className="text-center p-6 rounded-3xl border border-transparent bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 min-h-[180px]">
                  <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MOBILE LAYOUT (Vertical Timeline) */}
        <div className="md:hidden relative px-2">
            {/* Center Line */}
            <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-zinc-800" />
            
            <div className="flex flex-col gap-8">
                {steps.map((step, idx) => (
                    <div key={idx} className="relative pl-14">
                        {/* Dot */}
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-dark-bg border-2 border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 z-10">
                            {step.num}
                        </div>
                        
                        {/* Card */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                             <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                             <p className="text-sm text-zinc-400">{step.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
            <div className="bg-olive-dark/30 border border-olive/20 rounded-full px-6 py-2 md:px-8 md:py-3 backdrop-blur-sm">
                <p className="text-lavender font-medium tracking-wide text-xs md:text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Среднее время внедрения: <span className="text-white font-bold">2 дня</span>
                </p>
            </div>
        </motion.div>
      </div>
    </section>
  );
};