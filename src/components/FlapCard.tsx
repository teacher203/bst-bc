import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronDown, ChevronUp, Beaker, Lightbulb, ShieldAlert } from 'lucide-react';

interface FlapCardProps {
  title: string;
  hint: string;
  content: {
    secretTip: string;
    sciencePrinciple: string;
    goldenRule: string;
  };
  unitColor: string;
}

export const FlapCard: React.FC<FlapCardProps> = ({
  title,
  hint,
  content,
  unitColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative my-4 perspective-[1000px]">
      <div className="rounded-2xl border-2 border-amber-800/20 bg-stone-50/90 shadow-md overflow-hidden transition-all duration-300">
        
        {/* Flap Outer Header / Liftable Flap Cover */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 transition-all cursor-pointer ${
            isOpen
              ? 'bg-amber-100/70 border-b border-amber-200'
              : 'bg-gradient-to-r from-amber-50 to-stone-50 hover:bg-amber-100/50'
          }`}
          title="클릭하여 플랩북 비밀 노하우 열기"
        >
          <div className="flex items-center gap-3">
            {/* Wax Seal / Stamp visual */}
            <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-black shadow-xs shrink-0 ring-2 ring-amber-300">
              <Sparkles className="w-4 h-4 text-amber-100" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                  LIFT-THE-FLAP · 비밀 노트
                </span>
                <span className="text-xs text-amber-700 font-medium hidden sm:inline">
                  {isOpen ? '플랩 펼쳐짐' : '클릭하여 들추기'}
                </span>
              </div>
              <h4 className="font-serif-kr text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                {title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-amber-800 hidden xs:inline">
              {isOpen ? '플랩 닫기' : '플랩 들추기'}
            </span>
            <div className="w-7 h-7 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center text-amber-800">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Flap Revealed Content with Motion Animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden bg-white/95"
            >
              <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
                
                {/* 1. Secret Tip */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-amber-900 block mb-0.5">
                      파티시에 시크릿 테크닉
                    </span>
                    <p className="text-stone-700 leading-relaxed font-serif-kr">
                      {content.secretTip}
                    </p>
                  </div>
                </div>

                {/* 2. Science Principle */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Beaker className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-teal-900 block mb-0.5">
                      제과 식품 화학 원리 (Science)
                    </span>
                    <p className="text-stone-700 leading-relaxed font-serif-kr">
                      {content.sciencePrinciple}
                    </p>
                  </div>
                </div>

                {/* 3. Golden Rule */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-rose-900 block mb-0.5">
                      실패 방지 절대 골든 룰 (Golden Rule)
                    </span>
                    <p className="text-stone-700 leading-relaxed font-serif-kr">
                      {content.goldenRule}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
