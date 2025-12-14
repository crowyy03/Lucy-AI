import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Lite',
    minutes: '1 200',
    features: ['Голосовой ассистент 24/7', 'Настройка сценария', 'Интеграция с CRM', 'Базовая поддержка'],
    color: 'border-white/5',
    btnColor: 'bg-zinc-800 text-white hover:bg-zinc-700'
  },
  {
    name: 'Standart',
    minutes: '2 000',
    features: ['Голосовой ассистент 24/7', 'Настройка сценария', 'Интеграция с CRM', 'Регулярные улучшения'],
    recommended: true,
    color: 'border-lavender/50',
    btnColor: 'bg-lavender text-zinc-900 hover:bg-white'
  },
  {
    name: 'Pro',
    minutes: '3 000',
    features: ['Голосовой ассистент 24/7', 'Сложные сценарии', 'Интеграция с CRM', 'Приоритетная поддержка'],
    color: 'border-white/5',
    btnColor: 'bg-zinc-800 text-white hover:bg-zinc-700'
  },
  {
    name: 'Enterprise',
    minutes: '6 000+',
    features: ['Индивидуальное решение', 'Выделенный менеджер', 'Полная кастомизация', 'SLA контракт'],
    color: 'border-white/5',
    btnColor: 'bg-olive text-white hover:bg-olive-light'
  }
];

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-dark-bg relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-olive-dim/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Тарифы</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Прозрачное ценообразование без скрытых платежей.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`glass-card relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${tier.color} ${tier.recommended ? 'shadow-[0_0_40px_rgba(216,180,254,0.1)] z-10 scale-105' : 'hover:bg-white/5'}`}
            >
              {tier.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-lavender text-zinc-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Популярный
                </div>
              )}
              
              <h3 className="text-lg font-medium text-white mb-4">{tier.name}</h3>
              <div className="mb-8 flex items-baseline">
                <span className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{tier.minutes}</span>
                <span className="text-zinc-500 text-xs ml-2">мин</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-olive-light mr-3 flex-shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-medium text-sm transition-all ${tier.btnColor}`}>
                Выбрать
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};