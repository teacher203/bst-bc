import React from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';
import { UNITS_DATA } from '../data/unitsData';
import { PortfolioData } from '../types/portfolio';

interface TocDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: number;
  portfolio: PortfolioData;
  onSelectPage: (page: number) => void;
}

export const TocDrawer: React.FC<TocDrawerProps> = ({
  isOpen,
  onClose,
  activePage,
  portfolio,
  onSelectPage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity no-print">
      <div className="w-full max-w-md bg-stone-900 text-stone-100 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-stone-800">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase">
                QUICK NAVIGATOR
              </span>
              <h2 className="font-serif-kr text-xl font-bold text-white">
                B-디저트 실무 책갈피
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Page Links */}
          <div className="space-y-1 mb-6 text-xs">
            <button
              onClick={() => {
                onSelectPage(0);
                onClose();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium flex items-center justify-between transition-colors ${
                activePage === 0
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span>00. 앞표지 (B-디저트 실무)</span>
              <span className="text-[10px] opacity-70">Cover</span>
            </button>

            <button
              onClick={() => {
                onSelectPage(1);
                onClose();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium flex items-center justify-between transition-colors ${
                activePage === 1
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span>01. 속표지 · 인적사항과 다짐</span>
              <span className="text-[10px] opacity-70">Intro</span>
            </button>
            <button onClick={() => { onSelectPage(2); onClose(); }} className={`w-full text-left px-3 py-2.5 rounded-lg font-medium flex items-center justify-between transition-colors ${activePage === 2 ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'}`}><span>02. 전체 목차 &amp; 로드맵</span><span className="text-[10px] opacity-70">TOC</span></button>
          </div>

          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-1">
            20단원 개별 실습일지
          </p>

          {/* 20 Units List */}
          <div className="space-y-1 text-xs">
            {UNITS_DATA.map((unit, idx) => {
              const pageIndex = idx + 3;
              const log = portfolio.units[unit.id];
              const isDone = log?.isCompleted;
              const isCurrent = activePage === pageIndex;

              return (
                <button
                  key={unit.id}
                  onClick={() => {
                    onSelectPage(pageIndex);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{unit.icon}</span>
                    <span className="font-mono text-stone-400 text-[11px] shrink-0">
                      {unit.code}
                    </span>
                    <span className="truncate">{unit.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {log?.coachGrade && (
                      <span className="text-[10px] px-1 rounded bg-stone-700 text-stone-200 font-mono font-bold">
                        {log.coachGrade}
                      </span>
                    )}
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-stone-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-800">
            <button
              onClick={() => {
                onSelectPage(23);
                onClose();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium flex items-center justify-between text-xs transition-colors ${
                activePage === 23
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span>23. 포트폴리오 총평 및 뒷표지</span>
              <span className="text-[10px] opacity-70">Epilogue</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-stone-800 text-[11px] text-stone-500 text-center font-medium">
          B-디저트 실무 플립북 실습 포트폴리오
        </div>
      </div>
    </div>
  );
};
