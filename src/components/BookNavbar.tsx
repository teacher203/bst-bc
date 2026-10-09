import React from 'react';
import { Printer, FileSpreadsheet, UserPlus, FolderDown } from 'lucide-react';
import { StudentProfile } from '../types/portfolio';

interface BookNavbarProps {
  activePage: number;
  totalPages: number;
  student: StudentProfile;
  completedCount: number;
  onNavigate: (page: number) => void;
  onOpenToc: () => void;
  onPrintAll: () => void;
  onOpenGoogleSheets: () => void;
  onNewStudent: () => void;
  onDownloadZip?: () => void;
  onSave: () => void;
  saveStatus: string | null;
}

export const BookNavbar: React.FC<BookNavbarProps> = ({
  activePage,
  totalPages,
  student,
  completedCount,
  onNavigate,
  onOpenToc,
  onPrintAll,
  onOpenGoogleSheets,
  onNewStudent,
  onDownloadZip,
  onSave,
  saveStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(0)}
            className="text-left group flex items-center gap-2 hover:opacity-90 transition-opacity"
            title="표지로 이동"
          >
            <span className="font-serif-kr text-lg sm:text-xl font-bold tracking-tight text-amber-100 group-hover:text-amber-200 whitespace-nowrap">
              B-디저트 실무
            </span>
            <span className="hidden md:inline text-xs text-stone-400 font-normal whitespace-nowrap">
              · 부산관광고 전자책 포트폴리오
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden sm:flex items-center gap-5 text-xs md:text-sm font-medium text-stone-300">
          <button
            onClick={() => onNavigate(0)}
            className={`transition-colors hover:text-white pb-0.5 ${
              activePage === 0 ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            표지
          </button>
          <button
            onClick={() => onNavigate(1)}
            className={`transition-colors hover:text-white pb-0.5 ${
              activePage === 1 ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            목차
          </button>
          <button
            onClick={() => onNavigate(activePage >= 2 && activePage <= 21 ? activePage : 2)}
            className={`transition-colors hover:text-white pb-0.5 ${
              activePage >= 2 && activePage <= 21
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            실습일지 (20단원)
          </button>
          <button
            onClick={() => onNavigate(22)}
            className={`transition-colors hover:text-white pb-0.5 ${
              activePage === 22 ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            포트폴리오 총평
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="hidden lg:inline text-xs text-emerald-400 font-medium animate-pulse">
              {saveStatus}
            </span>
          )}

          <button
            onClick={onNewStudent}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors border border-stone-700"
            title="새 학생으로 실습일지 새로 작성하기"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">새 학생 작성</span>
          </button>

          {onDownloadZip && (
            <button
              onClick={onDownloadZip}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-200 bg-stone-800 hover:bg-stone-700 border border-amber-500/40 rounded-lg transition-colors shadow-xs"
              title="프로젝트 전체 소스코드 ZIP 파일 다운로드 (GitHub 수동 업로드용)"
            >
              <FolderDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap">소스 ZIP</span>
            </button>
          )}

          <button
            onClick={onOpenGoogleSheets}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-lg transition-colors"
            title="구글 스프레드시트 실시간 연동 설정"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="whitespace-nowrap hidden sm:inline">구글 시트 연동</span>
          </button>

          <button
            onClick={onPrintAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors shadow-sm"
            title="전체 20단원 포트폴리오를 책처럼 일괄 PDF 인쇄"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">PDF 책 인쇄</span>
          </button>
        </div>
      </div>
    </header>
  );
};
