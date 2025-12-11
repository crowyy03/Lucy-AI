import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, BarChart3, ShieldCheck, Coffee } from 'lucide-react';

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
    icon: <BarChart3 className="w-6 h-6 text-petrol-light" />
  }
];

export const BusinessBenefits: React.FC = () => {
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

        {/* Changed to 3 columns for better 6-item layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 rounded-3xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  {stat.icon}
              </div>
              
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                    {stat.value}
                </div>
                <h3 className="text-lg font-medium text-lavender mb-4">{stat.label}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed border-t border-zinc-800 pt-4">
                    {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Block within Benefits */}
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