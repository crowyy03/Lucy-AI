import React from 'react';
import { motion } from 'framer-motion';

export const Story: React.FC = () => {
  return (
    <section className="py-20 md:py-32 relative bg-dark-bg/50 border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-petrol-light font-mono text-xs uppercase tracking-[0.2em] mb-6 block">
              Наша миссия
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Почему мы создали <br />
              <span className="text-lavender">Lucy AI</span>?
            </h2>
            <div className="space-y-6 text-zinc-400 text-base md:text-lg leading-relaxed text-justify md:text-center">
              <p>
                Всё началось с простой проблемы. Мы заметили, как часто теряем время, вися на линии в ожидании ответа администратора. Гудки, музыка, «Ваш звонок очень важен для нас»... Это убивает лояльность с первых секунд.
              </p>
              <p>
                Или еще хуже: <span className="text-white font-medium">«Нажмите 1, чтобы записаться...»</span>. Этот бездушный робот заставляет клиента чувствовать себя строчкой в базе данных, а не желанным гостем.
              </p>
              <p>
                А бывало ли у вас такое, что вы вспоминали о записи к врачу или в салон поздно вечером? Звонить уже нельзя, писать в мессенджеры — долго. Вы откладываете это на утро и... забываете. Бизнес теряет деньги, вы теряете время.
              </p>
              <div className="pt-8">
                <p className="text-xl md:text-2xl text-white font-medium italic">
                  "Мы решили это исправить. Мы создали интеллект, который берет трубку мгновенно, в 3 часа ночи, и говорит с теплотой и заботой, как ваш лучший сотрудник."
                </p>
              </div>
            </div>
          </motion.div>

      </div>
    </section>
  );
};