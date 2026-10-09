/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookNavbar } from './components/BookNavbar';
import { BookCover } from './components/BookCover';
import { TableOfContents } from './components/TableOfContents';
import { UnitPage } from './components/UnitPage';
import { EpiloguePage } from './components/EpiloguePage';
import { PageNavigation } from './components/PageNavigation';
import { TocDrawer } from './components/TocDrawer';
import { PrintPortfolioView } from './components/PrintPortfolioView';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { UNITS_DATA } from './data/unitsData';
import {
  PortfolioData,
  UnitLog,
  StudentProfile,
} from './types/portfolio';
import {
  loadPortfolio,
  savePortfolio,
  exportPortfolioAsTxt,
  exportPortfolioAsJSON,
  createInitialPortfolio,
} from './utils/portfolioStorage';
import { downloadProjectZip } from './utils/projectZipExporter';
import { playPageTurnSound } from './utils/pageTurnSound';

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(() => loadPortfolio());
  const [activePage, setActivePage] = useState<number>(0); // 0: Cover, 1: TOC, 2..21: Units 1..20, 22: Epilogue
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState<boolean>(false);
  const [printMode, setPrintMode] = useState<'all' | 'single' | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [pageDirection, setPageDirection] = useState<1 | -1>(1);
  const [isPageSoundOn, setIsPageSoundOn] = useState<boolean>(() => {
    return localStorage.getItem('bst-page-sound') !== 'off';
  });

  // Autosave to localStorage on changes
  useEffect(() => {
    savePortfolio(portfolio);
  }, [portfolio]);

  const showSaveNotification = (msg: string = '저장 완료') => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 2000);
  };

  const handleUpdateStudent = (updatedProfile: Partial<StudentProfile>) => {
    setPortfolio((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        ...updatedProfile,
      },
    }));
    showSaveNotification('학생 정보 저장됨');
  };

  const handleUpdateLog = (unitId: number, updatedFields: Partial<UnitLog>) => {
    setPortfolio((prev) => {
      const existing = prev.units[unitId] || {
        unitId,
        date: new Date().toISOString().split('T')[0],
        dynamicData: {},
        satisfaction: 4,
        strength: '',
        reflection: '',
        improvement: '',
        isCompleted: false,
        lastUpdated: new Date().toISOString(),
      };

      return {
        ...prev,
        units: {
          ...prev.units,
          [unitId]: {
            ...existing,
            ...updatedFields,
          },
        },
      };
    });
    showSaveNotification('실습일지 저장됨');
  };

  const handleUpdateSummary = (
    summary: NonNullable<PortfolioData['finalSummary']>
  ) => {
    setPortfolio((prev) => ({
      ...prev,
      finalSummary: summary,
    }));
    showSaveNotification('총평 저장됨');
  };

  const handleNavigate = (page: number) => {
    const nextPage = Math.max(0, Math.min(22, page));
    if (nextPage === activePage) return;
    setPageDirection(nextPage > activePage ? 1 : -1);
    if (isPageSoundOn) playPageTurnSound();
    setActivePage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePageSound = () => {
    setIsPageSoundOn((current) => {
      const next = !current;
      localStorage.setItem('bst-page-sound', next ? 'on' : 'off');
      if (next) playPageTurnSound();
      return next;
    });
  };

  const handleToggleBookmark = (page: number) => {
    setPortfolio((prev) => {
      const isBookmarked = prev.bookmarkedPages.includes(page);
      const updated = isBookmarked
        ? prev.bookmarkedPages.filter((p) => p !== page)
        : [...prev.bookmarkedPages, page];
      return {
        ...prev,
        bookmarkedPages: updated,
      };
    });
  };

  const handleNewStudent = () => {
    const studentName = prompt('새로 작성할 학생의 이름을 입력해 주세요:', '');
    if (studentName === null) return;
    const studentNo = prompt('학번을 입력해 주세요 (예: 30502):', '') || '';

    const newPortfolio = createInitialPortfolio();
    newPortfolio.student.studentName = studentName || '신규 학생';
    newPortfolio.student.studentNo = studentNo;
    // reset units so student starts fresh
    UNITS_DATA.forEach((u) => {
      newPortfolio.units[u.id] = {
        unitId: u.id,
        date: new Date().toISOString().split('T')[0],
        procedureNotes: '',
        dynamicData: {},
        satisfaction: 4,
        strength: '',
        reflection: '',
        improvement: '',
        isCompleted: false,
        lastUpdated: new Date().toISOString(),
      };
    });

    setPortfolio(newPortfolio);
    setActivePage(0);
    showSaveNotification('새 학생 포트폴리오가 생성되었습니다');
  };

  const handleSaveWebhookUrl = (url: string) => {
    setPortfolio((prev) => ({
      ...prev,
      googleSheetsWebhookUrl: url,
    }));
    showSaveNotification('구글 시트 연동 URL 저장 완료');
  };

  const completedCount = Object.values(portfolio.units).filter((u) => u.isCompleted).length;
  const isBookmarked = portfolio.bookmarkedPages.includes(activePage);

  // Print view mode
  if (printMode) {
    const activeUnitId = activePage >= 2 && activePage <= 21 ? activePage - 1 : undefined;
    return (
      <PrintPortfolioView
        portfolio={portfolio}
        student={portfolio.student}
        activeUnitId={activeUnitId}
        mode={printMode}
        onClose={() => setPrintMode(null)}
      />
    );
  }

  const renderBookPage = (page: number) => {
    if (page === 0) {
      return (
        <BookCover
          student={portfolio.student}
          onUpdateStudent={handleUpdateStudent}
          onOpenBook={() => handleNavigate(2)}
          onViewToc={() => handleNavigate(1)}
          onNewStudent={handleNewStudent}
          onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
          completedCount={completedCount}
        />
      );
    }

    if (page === 1) {
      return (
        <TableOfContents
          portfolio={portfolio}
          onNavigateToUnit={(unitId) => handleNavigate(unitId + 1)}
          onNavigateToCover={() => handleNavigate(0)}
          onNavigateToEpilogue={() => handleNavigate(22)}
        />
      );
    }

    if (page >= 2 && page <= 21) {
      const unit = UNITS_DATA[page - 2];
      const log = portfolio.units[unit.id];
      if (!log) return null;
      return (
        <UnitPage
          key={unit.id}
          unit={unit}
          log={log}
          student={portfolio.student}
          onUpdateLog={(updated) => handleUpdateLog(unit.id, updated)}
          onPrevUnit={() => handleNavigate(Math.max(1, page - 1))}
          onNextUnit={() => handleNavigate(Math.min(22, page + 1))}
          onPrintThisPage={() => {
            setActivePage(page);
            setPrintMode('single');
          }}
          onOpenGoogleSheetsModal={() => setIsGoogleSheetsOpen(true)}
          isFirstUnit={unit.id === 1}
          isLastUnit={unit.id === 20}
          googleSheetsWebhookUrl={portfolio.googleSheetsWebhookUrl}
        />
      );
    }

    return (
      <EpiloguePage
        portfolio={portfolio}
        student={portfolio.student}
        onUpdateSummary={handleUpdateSummary}
        onPrintAll={() => setPrintMode('all')}
        onExportTxt={() => exportPortfolioAsTxt(portfolio)}
        onExportJson={() => exportPortfolioAsJSON(portfolio)}
        onDownloadZip={downloadProjectZip}
        onNavigateToCover={() => handleNavigate(0)}
      />
    );
  };

  const leftPage = activePage === 0 ? null : activePage % 2 === 1 ? activePage : activePage - 1;
  const rightPage = activePage === 0 ? 0 : leftPage !== null && leftPage + 1 <= 22 ? leftPage + 1 : null;

  return (
    <div className="min-h-screen bg-stone-200/90 text-stone-900 flex flex-col selection:bg-amber-100 selection:text-amber-900 pb-20">
      
      {/* Top Bar Header */}
      <BookNavbar
        activePage={activePage}
        totalPages={23}
        student={portfolio.student}
        completedCount={completedCount}
        onNavigate={handleNavigate}
        onOpenToc={() => setIsTocOpen(true)}
        onPrintAll={() => setPrintMode('all')}
        onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
        onNewStudent={handleNewStudent}
        onDownloadZip={downloadProjectZip}
        onSave={() => showSaveNotification('로컬 브라우저에 보관되었습니다')}
        saveStatus={saveStatus}
      />

      {/* Desktop opens as a true two-page spread; mobile keeps one readable leaf. */}
      <main className="flex-1 book-stage px-0 lg:px-4 py-0 lg:py-7">
        <div className={`open-book ${activePage === 0 ? 'is-cover' : ''}`}>
          {leftPage !== null && (
            <section className={`book-face book-face-left ${activePage === leftPage ? 'is-active-page' : ''}`} aria-label={`${leftPage}쪽`}>
              {renderBookPage(leftPage)}
            </section>
          )}
          {rightPage !== null && (
            <section className={`book-face book-face-right ${activePage === rightPage ? 'is-active-page' : ''}`} aria-label={`${rightPage}쪽`}>
              {renderBookPage(rightPage)}
            </section>
          )}

          <AnimatePresence custom={pageDirection} initial={false}>
            <motion.div
              key={activePage}
              custom={pageDirection}
              className={`turning-leaf ${pageDirection > 0 ? 'turning-forward' : 'turning-backward'}`}
              initial={{ rotateY: 0, filter: 'brightness(1)' }}
              animate={{
                rotateY: pageDirection > 0 ? -180 : 180,
                opacity: [1, 1, 0],
                filter: ['brightness(1)', 'brightness(0.7)', 'brightness(1)'],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, times: [0, 0.88, 1], ease: [0.3, 0.02, 0.18, 1] }}
              aria-hidden="true"
            >
              <span className="turning-leaf-paper" />
            </motion.div>
          </AnimatePresence>
          <span className="book-gutter" aria-hidden="true" />
        </div>
      </main>

      {/* Bottom Floating Page Navigator */}
      <PageNavigation
        activePage={activePage}
        totalPages={23}
        onNavigate={handleNavigate}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={isBookmarked}
        isPageSoundOn={isPageSoundOn}
        onTogglePageSound={handleTogglePageSound}
      />

      {/* Slide-out Quick Table of Contents Drawer */}
      <TocDrawer
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        activePage={activePage}
        portfolio={portfolio}
        onSelectPage={handleNavigate}
      />

      {/* Google Sheets Live Sync Modal */}
      <GoogleSheetsSyncModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
        portfolio={portfolio}
        student={portfolio.student}
        onSaveWebhookUrl={handleSaveWebhookUrl}
      />

    </div>
  );
}
