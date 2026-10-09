import React, { useState } from 'react';
import { Award, Download, BookmarkCheck, FileText, FolderDown } from 'lucide-react';
import { PortfolioData, StudentProfile } from '../types/portfolio';
import { UNITS_DATA } from '../data/unitsData';

interface EpiloguePageProps {
  portfolio: PortfolioData;
  student: StudentProfile;
  onUpdateSummary: (summary: NonNullable<PortfolioData['finalSummary']>) => void;
  onPrintAll: () => void;
  onExportTxt: () => void;
  onExportJson: () => void;
  onDownloadZip?: () => void;
  onNavigateToCover: () => void;
}

export const EpiloguePage: React.FC<EpiloguePageProps> = ({
  portfolio,
  student,
  onUpdateSummary,
  onPrintAll,
  onExportTxt,
  onExportJson,
  onDownloadZip,
  onNavigateToCover,
}) => {
  const summary = portfolio.finalSummary || {
    overallReflection: '',
    favoriteUnit: 1,
    skillsMastered: [],
    teacherEvaluationNotes: '',
  };

  const [reflection, setReflection] = useState(summary.overallReflection);
  const [favoriteUnit, setFavoriteUnit] = useState(summary.favoriteUnit);
  const [teacherNotes, setTeacherNotes] = useState(summary.teacherEvaluationNotes || '');

  const completedUnits = Object.values(portfolio.units).filter((u) => u.isCompleted);
  const totalCount = UNITS_DATA.length;
  const isAllComplete = completedUnits.length === totalCount;

  // Grade count breakdown
  const gradeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  Object.values(portfolio.units).forEach((u) => {
    if (u.coachGrade && gradeCounts[u.coachGrade] !== undefined) {
      gradeCounts[u.coachGrade]++;
    }
  });

  const handleSave = () => {
    onUpdateSummary({
      ...summary,
      overallReflection: reflection,
      favoriteUnit,
      teacherEvaluationNotes: teacherNotes,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="bg-white rounded-2xl border border-stone-300 shadow-xl overflow-hidden book-page-leaf p-6 sm:p-10 space-y-8">
        
        {/* Editorial Top Ribbon */}
        <div className="border-b border-stone-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-widest mb-1">
            <Award className="w-4 h-4 text-amber-600" />
            <span>PORTFOLIO COMPLETION &amp; CERTIFICATION</span>
          </div>
          <h1 className="font-serif-kr text-2xl sm:text-4xl font-bold text-stone-900">
            20단원 종합 성찰 및 포트폴리오 총평
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            부산관광고 B-디저트 실무 20단원 전 과정을 아우르는 최종 소감과 종합 평가 확인란입니다.
          </p>
        </div>

        {/* Portfolio Stats Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
          <div>
            <span className="text-stone-500 block">이수 완료율</span>
            <span className="text-lg font-black text-stone-900">
              {completedUnits.length} / {totalCount} 단원
            </span>
          </div>
          <div>
            <span className="text-stone-500 block">A등급 획득</span>
            <span className="text-lg font-black text-teal-700">
              {gradeCounts.A}개 단원
            </span>
          </div>
          <div>
            <span className="text-stone-500 block">B등급 획득</span>
            <span className="text-lg font-black text-sky-700">
              {gradeCounts.B}개 단원
            </span>
          </div>
          <div>
            <span className="text-stone-500 block">포트폴리오 상태</span>
            <span className={`text-lg font-black ${isAllComplete ? 'text-teal-700' : 'text-amber-700'}`}>
              {isAllComplete ? '수료 완료' : '진행 중'}
            </span>
          </div>
        </div>

        {/* Student Synthesis Essay */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-stone-900 font-serif-kr">
            1. 학생 최종 종합 성찰문 (20단원 실습을 마치며)
          </label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            onBlur={handleSave}
            rows={5}
            placeholder="20단원의 실습 과정을 통해 습득한 기술적 발전, 실패를 극복한 경험, 파티시에로서의 비전을 자유롭게 서술하세요."
            className="w-full p-4 text-xs sm:text-sm bg-stone-50/60 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-stone-500 leading-relaxed font-serif-kr"
          />
        </div>

        {/* Favorite Unit Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-stone-900 font-serif-kr">
            2. 나만의 베스트 시그니처 디저트 단원
          </label>
          <select
            value={favoriteUnit}
            onChange={(e) => {
              setFavoriteUnit(Number(e.target.value));
              handleSave();
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-500"
          >
            {UNITS_DATA.map((u) => (
              <option key={u.id} value={u.id}>
                {u.code}단원 · {u.title} ({u.moduleGroup})
              </option>
            ))}
          </select>
        </div>

        {/* Teacher Evaluation Box */}
        <div className="p-6 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-kr text-base font-bold text-stone-900 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-amber-700" />
              <span>3. 실습 종합 평가의견</span>
            </h3>
          </div>

          <textarea
            value={teacherNotes}
            onChange={(e) => setTeacherNotes(e.target.value)}
            onBlur={handleSave}
            rows={3}
            placeholder="학생의 성실도, 공정 원인 분석 태도, 시그니처 디저트 창의성에 대한 종합 평가를 입력합니다."
            className="w-full p-3.5 text-xs sm:text-sm bg-white border border-amber-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 leading-relaxed"
          />

          {/* Official Stamp & Certificate Text */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-amber-200 text-xs">
            {/* 🌟 사용자 요청: 한 줄로 명확하게 표시되는 인증 문구 */}
            <div className="overflow-x-auto py-1">
              <p className="text-stone-800 font-bold text-xs sm:text-sm whitespace-nowrap">
                본 포트폴리오는 부산관광고 B-디저트 실무 교육과정에 의거하여 정식 기록되었음을 인증합니다.
              </p>
            </div>

            {/* 🌟 공식 도장: "부산관광고 교사 서은주 확인" */}
            <div
              className="relative w-24 h-24 rounded-full border-2 border-red-600 text-red-600 flex flex-col items-center justify-center font-serif-kr p-1 shrink-0 rotate-[-5deg] shadow-xs select-none bg-red-50/30 self-end md:self-auto"
              style={{
                boxShadow: 'inset 0 0 0 1.5px rgba(220, 38, 38, 0.5)',
              }}
              title="부산관광고 교사 서은주 확인 직인"
            >
              {/* Inner ring */}
              <div className="w-21 h-21 rounded-full border border-red-600/70 flex flex-col items-center justify-center text-center leading-tight">
                <span className="text-[10px] font-bold tracking-tight">부산관광고</span>
                <span className="text-[11px] font-black tracking-tight my-0.5">교사 서은주</span>
                <span className="text-[10px] font-bold text-red-600 tracking-wider">확인 [印]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel for Student Portfolio */}
        <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={onNavigateToCover}
            className="text-stone-600 hover:text-stone-900 font-medium py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            ← 첫 페이지(표지)로 돌아가기
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onExportTxt}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 text-stone-700 border border-stone-300 rounded-lg font-medium hover:bg-stone-200 transition-colors"
              title="텍스트 파일로 내려받기"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>텍스트 다운로드</span>
            </button>

            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 text-stone-700 border border-stone-300 rounded-lg font-medium hover:bg-stone-200 transition-colors"
              title="데이터 백업 JSON 저장"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON 데이터 백업</span>
            </button>

            {onDownloadZip && (
              <button
                onClick={onDownloadZip}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 text-amber-300 border border-stone-700 rounded-lg font-bold hover:bg-stone-700 transition-colors shadow-xs"
                title="프로젝트 전체 소스코드 ZIP 다운로드 (GitHub 수동 업로드용)"
              >
                <FolderDown className="w-3.5 h-3.5 text-amber-400" />
                <span>프로젝트 소스 ZIP 다운로드</span>
              </button>
            )}

            <button
              onClick={onPrintAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg font-bold transition-all shadow-md"
            >
              <span>🖨️ 전체 포트폴리오 PDF 인쇄</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
