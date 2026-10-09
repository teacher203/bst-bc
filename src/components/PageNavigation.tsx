import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Bookmark } from 'lucide-react';
import { UNITS_DATA } from '../data/unitsData';

interface PageNavigationProps {
  activePage: number;
  totalPages: number;
  onNavigate: (page: number) => void;
  onToggleBookmark: (page: number) => void;
  isBookmarked: boolean;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  activePage,
  totalPages,
  onNavigate,
  onToggleBookmark,
  isBookmarked,
}) => {
  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'ArrowLeft' && activePage > 0) {
        onNavigate(activePage - 1);
      } else if (e.key === 'ArrowRight' && activePage < totalPages - 1) {
        onNavigate(activePage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePage, totalPages, onNavigate]);

  const getPageTitle = (page: number): string => {
    if (page === 0) return '표지 · B-디저트 실무';
    if (page === 1) return '목차 · 전체 20단원 인덱스';
    if (page >= 2 && page <= 21) {
      const u = UNITS_DATA[page - 2];
      return `${u.code}단원 · ${u.title}`;
    }
    if (page === 22) return '총평 · 종합 수료 평가';
    return `페이지 ${page}`;
  };

  return (
    <aside aria-label="도서 페이지 탐색" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94%] sm:w-auto bg-stone-900/90 backdrop-blur-md text-stone-100 px-4 py-2.5 rounded-2xl border border-stone-700 shadow-2xl flex items-center justify-between gap-3 no-print">
      
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onNavigate(Math.max(0, activePage - 1))}
        disabled={activePage === 0}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          activePage === 0
            ? 'text-stone-500 cursor-not-allowed opacity-50'
            : 'text-stone-200 hover:text-white hover:bg-stone-800'
        }`}
        title="이전 페이지 (단축키: ←)"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden xs:inline">이전</span>
      </button>

      {/* Middle Page Selector & Info */}
      <div className="flex items-center gap-2 text-xs">
        <select
          value={activePage}
          onChange={(e) => onNavigate(Number(e.target.value))}
          className="bg-stone-800 text-stone-200 border border-stone-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400 font-medium cursor-pointer"
        >
          <option value={0}>00. 표지 (B-디저트 실무)</option>
          <option value={1}>01. 전체 목차 (20단원 인덱스)</option>
          {UNITS_DATA.map((u, idx) => (
            <option key={u.id} value={idx + 2}>
              {String(idx + 2).padStart(2, '0')}. {u.code}단원 {u.title}
            </option>
          ))}
          <option value={22}>22. 포트폴리오 총평 및 수료</option>
        </select>

        <span className="text-stone-400 font-mono hidden md:inline">
          {activePage} / {totalPages - 1} p
        </span>
      </div>

      {/* Next Button */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onToggleBookmark(activePage)}
          className={`p-1.5 rounded-lg transition-colors ${
            isBookmarked
              ? 'text-amber-400 bg-amber-400/10'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
          title={isBookmarked ? '북마크 해제' : '이 페이지 책갈피(북마크)'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate(Math.min(totalPages - 1, activePage + 1))}
          disabled={activePage === totalPages - 1}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activePage === totalPages - 1
              ? 'text-stone-500 cursor-not-allowed opacity-50'
              : 'text-stone-200 hover:text-white hover:bg-stone-800'
          }`}
          title="다음 페이지 (단축키: →)"
        >
          <span className="hidden xs:inline">다음</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
};
