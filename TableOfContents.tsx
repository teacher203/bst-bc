import React from 'react';
import { CheckCircle2, Circle, ArrowRight, BookOpen, Award, Bookmark } from 'lucide-react';
import { UNITS_DATA, MODULE_GROUPS } from '../data/unitsData';
import { PortfolioData } from '../types/portfolio';

interface TableOfContentsProps {
  portfolio: PortfolioData;
  onNavigateToUnit: (unitId: number) => void;
  onNavigateToCover: () => void;
  onNavigateToEpilogue: () => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  portfolio,
  onNavigateToUnit,
  onNavigateToCover,
  onNavigateToEpilogue,
}) => {
  const completedCount = Object.values(portfolio.units).filter((u) => u.isCompleted).length;
  const progressPercent = Math.round((completedCount / UNITS_DATA.length) * 100);

  // Compute average score of evaluated units
  const gradedUnits = Object.values(portfolio.units).filter((u) => u.coachScore !== undefined);
  const avgScore = gradedUnits.length > 0
    ? Math.round(gradedUnits.reduce((acc, u) => acc + (u.coachScore || 0), 0) / gradedUnits.length)
    : null;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      {/* Editorial Header */}
      <div className="bg-white rounded-2xl border border-stone-300 p-6 sm:p-8 shadow-sm mb-6 book-page-leaf">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6 mb-6">
          <div>
            <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase block mb-1">
              PORTFOLIO CONTENTS · 20 UNITS
            </span>
            <h2 className="font-serif-kr text-2xl sm:text-3xl font-bold text-stone-900">
              실습일지 전체 목차
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              단원 번호를 클릭하면 해당 실습 페이지로 바로 책장을 넘깁니다.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 text-xs text-stone-600 bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-400 block">완료 단원</span>
              <span className="text-sm font-bold text-stone-900">{completedCount} / 20</span>
            </div>
            <div className="h-6 w-px bg-stone-200" />
            <div>
              <span className="text-stone-400 block">달성률</span>
              <span className="text-sm font-bold text-teal-700">{progressPercent}%</span>
            </div>
            {avgScore !== null && (
              <>
                <div className="h-6 w-px bg-stone-200" />
                <div>
                  <span className="text-stone-400 block">평균 코칭점수</span>
                  <span className="text-sm font-bold text-amber-700">{avgScore}점</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-stone-500 mb-1.5">
            <span>20단원 포트폴리오 진행 상황</span>
            <span className="font-semibold text-stone-700">{completedCount} / 20단원 완료</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-amber-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Modules Accordion / Groups */}
        <div className="space-y-8">
          {MODULE_GROUPS.map((mod, modIdx) => (
            <div key={modIdx} className="space-y-3">
              <h3 className="font-serif-kr text-sm sm:text-base font-bold text-stone-800 flex items-center gap-2 pb-1 border-b border-stone-200">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>{mod.name}</span>
                <span className="text-xs text-stone-400 font-normal ml-auto">
                  {mod.units.length}개 단원
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mod.units.map((unitId) => {
                  const unit = UNITS_DATA.find((u) => u.id === unitId);
                  if (!unit) return null;
                  const log = portfolio.units[unitId];
                  const isDone = log?.isCompleted;

                  return (
                    <button
                      key={unitId}
                      onClick={() => onNavigateToUnit(unitId)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                        isDone
                          ? 'bg-stone-50/80 border-stone-300 hover:border-teal-500 hover:shadow-sm'
                          : 'bg-white border-stone-200 hover:border-amber-400 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-xs border border-stone-200"
                          style={{ backgroundColor: unit.softHex }}
                        >
                          {unit.icon}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-stone-900 truncate group-hover:text-amber-800 transition-colors whitespace-nowrap">
                            <span className="font-mono text-stone-500 mr-1.5">{unit.code}단원 ·</span>
                            {unit.title}
                          </h4>
                          <p className="text-xs text-stone-500 truncate mt-0.5">
                            {unit.goal}
                          </p>
                        </div>
                      </div>

                      {/* Right Badge Status */}
                      <div className="flex items-center gap-2 shrink-0">
                        {log?.coachGrade && (
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black text-white ${
                              log.coachGrade === 'A'
                                ? 'bg-teal-600'
                                : log.coachGrade === 'B'
                                ? 'bg-sky-600'
                                : log.coachGrade === 'C'
                                ? 'bg-amber-600'
                                : 'bg-stone-500'
                            }`}
                            title={`코칭 등급: ${log.coachGrade} (${log.coachScore}점)`}
                          >
                            {log.coachGrade}
                          </span>
                        )}

                        {isDone ? (
                          <span className="text-teal-600 flex items-center text-xs font-semibold gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="hidden sm:inline">완료</span>
                          </span>
                        ) : (
                          <span className="text-stone-400 group-hover:text-stone-600">
                            <Circle className="w-4 h-4" />
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-700 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Jump buttons */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <button
            onClick={onNavigateToCover}
            className="text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 py-1 px-2.5 rounded bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            ← 앞표지(Cover)로 돌아가기
          </button>
          <button
            onClick={onNavigateToEpilogue}
            className="text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 py-1 px-3 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
          >
            포트폴리오 총평 및 수료 페이지로 이동 →
          </button>
        </div>
      </div>
    </div>
  );
};
