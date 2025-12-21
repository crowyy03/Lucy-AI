import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, CheckCircle, Loader2 } from 'lucide-react';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMmrDrNtdzLpRFpyt9E8I0e2q3LGmvacNepirdu9VUWmXaF7nWFW9hJDl5nqts90jUJg/exec";

export const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    setIsLoading(true);

    if (!GOOGLE_SCRIPT_URL) {
        console.warn("GOOGLE_SCRIPT_URL не установлен. Данные не отправлены в таблицу.");
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1000);
        return;
    }

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        setIsLoading(false);
        setIsSubmitted(true);
    } catch (error) {
        console.error("Error submitting form", error);
        setIsLoading(false);
        alert("Произошла ошибка при отправке. Попробуйте еще раз.");
    }
  };

  return (
    <footer id="contact" className="bg-dark-bg border-t border-zinc-900 pt-16 md:pt-24 pb-12 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-olive-dim/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">Готовы автоматизировать общение?</h2>
            <p className="text-zinc-500 text-base md:text-lg mb-8 leading-relaxed max-w-md">
              Оставьте заявку. Мы свяжемся с вами, чтобы обсудить детали и бесплатно настроить демо-сценарий именно под ваш бизнес.
            </p>
            
            <div className="space-y-6">
              <a href="https://t.me/ilya_lucyai" target="_blank" rel="noreferrer" className="flex items-center group">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-lavender transition-colors mr-5">
                  <Send className="text-lavender w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Telegram</p>
                  <p className="text-white text-lg group-hover:text-lavender transition-colors">@ilya_lucyai</p>
                </div>
              </a>
              
              <a href="tel:+79112107857" className="flex items-center group">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-olive-light transition-colors mr-5">
                  <Phone className="text-olive-light w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Телефон</p>
                  <p className="text-white text-lg group-hover:text-olive-light transition-colors">+7 911 210-78-57</p>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-6 md:p-10 rounded-3xl"
          >
            {isSubmitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                    >
                        <CheckCircle className="text-green-500 w-8 h-8" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Заявка принята!</h3>
                    <p className="text-zinc-400">Наш менеджер свяжется с вами в Telegram или по телефону в течение 15 минут.</p>
                </div>
            ) : (
                <>
                    <h3 className="text-2xl font-bold text-white mb-2">Заявка на пилот</h3>
                    <p className="text-zinc-500 text-sm mb-6">Ваши данные в безопасности и не будут переданы третьим лицам.</p>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-dark-bg/50 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-olive transition-colors placeholder:text-zinc-600" 
                            placeholder="Ваше имя" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <input 
                            required
                            type="tel" 
                            className="w-full bg-dark-bg/50 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-olive transition-colors placeholder:text-zinc-600" 
                            placeholder="Телефон" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-olive to-olive-light text-white font-bold py-5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Обсудить проект'}
                      </button>
                      <div className="text-center text-xs text-zinc-600 pt-2">
                        Нажимая кнопку, вы соглашаетесь с <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400 transition-colors">Политикой конфиденциальности</a> и даёте согласие на обработку персональных данных.
                      </div>
                    </form>
                </>
            )}
          </motion.div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-600">
          <p>© {new Date().getFullYear()} Lucy AI. Все права защищены.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  );
};