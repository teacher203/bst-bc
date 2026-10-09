import React, { useState } from 'react';
import { ArrowLeft, Printer, Layers } from 'lucide-react';
import { PortfolioData, StudentProfile } from '../types/portfolio';
import { UNITS_DATA } from '../data/unitsData';
import { getStudentCoverTheme } from '../utils/coverThemes';

interface PrintPortfolioViewProps {
  portfolio: PortfolioData;
  student: StudentProfile;
  activeUnitId?: number;
  mode: 'all' | 'single';
  onClose: () => void;
}

export const PrintPortfolioView: React.FC<PrintPortfolioViewProps> = ({
  portfolio,
  student,
  activeUnitId,
  mode: initialMode,
  onClose,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'completedOnly' | 'single'>(
    initialMode === 'single' ? 'single' : 'all'
  );

  const completedUnits = UNITS_DATA.filter((u) => portfolio.units[u.id]?.isCompleted);
  const currentTheme = getStudentCoverTheme(student.studentNo, student.studentName, student.coverThemeId);

  const unitsToRender =
    filterMode === 'single' && activeUnitId
      ? UNITS_DATA.filter((u) => u.id === activeUnitId)
      : filterMode === 'completedOnly'
      ? completedUnits.length > 0
        ? completedUnits
        : UNITS_DATA.slice(0, 1) // fallback to at least 1 unit
      : UNITS_DATA;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-200 py-6 px-4">
      
      {/* On-Screen Toolbar (Hidden during print) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 no-print bg-stone-900 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>화면으로 복귀</span>
          </button>
          <span className="text-xs text-stone-300 font-medium">
            인쇄 모드: {unitsToRender.length}개 단원 선택됨
          </span>
        </div>

        {/* Filter Selection for Accumulated PDF Portfolio */}
        <div className="flex items-center gap-2">
          {initialMode !== 'single' && (
            <div className="flex bg-stone-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterMode === 'all'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                전체 20단원
              </button>
              <button
                onClick={() => setFilterMode('completedOnly')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  filterMode === 'completedOnly'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="지금까지 작성 완료된 단원만 모아서 누적 PDF 출력"
              >
                <Layers className="w-3 h-3" />
                <span>누적 완료본만 ({completedUnits.length}단원)</span>
              </button>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ PDF 책으로 인쇄 / 저장</span>
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div className="max-w-[210mm] mx-auto space-y-8">
        
        {/* ================= 1. FRONT COVER (Only in book modes) ================= */}
        {filterMode !== 'single' && (
          <section className="w-[210mm] min-h-[297mm] p-[16mm] bg-white mx-auto shadow-md border border-stone-300 flex flex-col justify-between print:border-none print:shadow-none print-page-break">
            <div>
              <div className="border-b-4 border-amber-600 pb-4 mb-8 flex justify-between items-end">
                <div>
                  <span className="text-xs tracking-widest text-stone-600 uppercase font-bold">
                    부산관광고등학교 · MICE외식조리과
                  </span>
                  <p className="text-sm font-bold text-stone-900 mt-1">
                    {student.academicYear} 전문교과 개인 실습 포트폴리오
                  </p>
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  B-DESSERT PORTFOLIO
                </div>
              </div>

              <div className="text-center my-8">
                <span className="text-base text-stone-600 font-serif-kr block mb-2">
                  로컬 스토리와 전문 테크닉을 담은 20단원 파티시에 실습일지
                </span>
                <h1 className="font-serif-kr text-5xl font-black text-stone-950 tracking-tight leading-tight">
                  B-디저트 실무
                </h1>
                <div className="w-24 h-1 bg-amber-600 mx-auto my-5" />
                <p className="text-sm text-stone-600 font-serif-kr max-w-md mx-auto italic">
                  "{student.portfolioMotto || '식재료의 본질과 정밀한 제과 테크닉으로 완성하는 나만의 디저트 포트폴리오'}"
                </p>
                {filterMode === 'completedOnly' && (
                  <div className="inline-block mt-3 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs text-teal-800 font-semibold">
                    [누적 포트폴리오 에디션 · {completedUnits.length}단원 수록]
                  </div>
                )}
              </div>

              {/* Cover Image Presentation */}
              <div className="w-64 h-80 mx-auto rounded-xl overflow-hidden border-2 border-stone-200 shadow-sm my-6 relative bg-stone-950">
                {student.customCoverImage ? (
                  <img
                    src={student.customCoverImage}
                    alt="맞춤 책 표지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <img
                      src={`${import.meta.env.BASE_URL}images/cover.jpg`}
                      alt="B-디저트 실무 표지"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 mix-blend-color opacity-35 pointer-events-none"
                      style={{ backgroundColor: currentTheme.accentColor }}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Student Credentials Block on Cover */}
            <div className="border border-stone-300 rounded-xl p-6 bg-stone-50/70 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-stone-500 block">소속 학교 / 학과</span>
                  <span className="font-bold text-stone-900">
                    부산관광고등학교 MICE외식조리과
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-500 block">성명 / 학번</span>
                  <span className="font-bold text-stone-900">
                    {student.studentName || '미입력'} ({student.studentNo || '학번'})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-500 block">실습 단원</span>
                  <span className="font-bold text-stone-900">
                    전체 20단원 과정
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-500 block">발행일</span>
                  <span className="font-bold text-stone-900">
                    {new Date().toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= 2. TABLE OF CONTENTS (Only in book modes) ================= */}
        {filterMode !== 'single' && (
          <section className="w-[210mm] min-h-[297mm] p-[16mm] bg-white mx-auto shadow-md border border-stone-300 print:border-none print:shadow-none print-page-break">
            <div className="border-b-2 border-stone-800 pb-3 mb-6 flex justify-between items-baseline">
              <h2 className="font-serif-kr text-2xl font-bold text-stone-900">
                실습 포트폴리오 목차 (Table of Contents)
              </h2>
              <span className="text-xs text-stone-500 font-mono">
                {filterMode === 'completedOnly' ? 'ACCUMULATED UNITS' : '20 UNITS CURRICULUM'}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {unitsToRender.map((unit) => {
                const log = portfolio.units[unit.id];
                return (
                  <div
                    key={unit.id}
                    className="flex items-center justify-between py-1.5 border-b border-stone-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-stone-500 w-14">
                        UNIT {unit.code}
                      </span>
                      {/* 🌟 한 줄로 표시되는 단원명 */}
                      <span className="font-bold text-stone-900 whitespace-nowrap">
                        {unit.code}단원 · {unit.title}
                      </span>
                      <span className="text-stone-400 hidden sm:inline">
                        · {unit.moduleGroup}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <span className="text-stone-500 font-mono">
                        {log?.date || '-'}
                      </span>
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center font-black text-white text-[11px] ${
                          log?.coachGrade === 'A'
                            ? 'bg-teal-700'
                            : log?.coachGrade === 'B'
                            ? 'bg-sky-700'
                            : 'bg-stone-400'
                        }`}
                      >
                        {log?.coachGrade || '-'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs flex justify-between items-center">
              <span>부산관광고등학교 MICE외식조리과 B-디저트 실무 교육과정</span>
              <span className="font-semibold text-stone-700">
                누적 {unitsToRender.length}개 단원 확인 날인
              </span>
            </div>
          </section>
        )}

        {/* ================= 3. UNIT WORKBOOK SHEETS ================= */}
        {unitsToRender.map((unit) => {
          const log = portfolio.units[unit.id];
          const isStandardGuide = unit.id >= 14;

          return (
            <article
              key={unit.id}
              className="w-[210mm] min-h-[297mm] p-[13mm] bg-white mx-auto shadow-md border border-stone-300 print:border-none print:shadow-none print-page-break flex flex-col justify-between text-xs"
            >
              <div>
                {/* Unit Header (NO TEACHER INFO, clean student & date) */}
                <div className="border-b-2 border-stone-900 pb-2.5 mb-3 flex justify-between items-end">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono tracking-wider text-stone-500 uppercase block truncate">
                      {unit.moduleGroup} · PRACTICUM WORKBOOK
                    </span>
                    {/* 🌟 한 줄로 표시되는 단원명 */}
                    <h2 className="font-serif-kr text-lg sm:text-xl font-black text-stone-900 mt-0.5 whitespace-nowrap">
                      {unit.code}단원 · {unit.title}
                    </h2>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-bold text-stone-800 whitespace-nowrap">
                      작성자: {student.studentName || '성명 미입력'} ({student.studentNo || '학번'})
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      실습일: {log?.date || '미입력'}
                    </div>
                  </div>
                </div>

                {/* Learning Goal */}
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 mb-3">
                  <p className="font-bold text-stone-800 text-[10px] mb-0.5">■ 단원 학습목표</p>
                  <p className="text-stone-700 leading-relaxed font-serif-kr text-[11px]">
                    {unit.goal}
                  </p>
                </div>

                {/* 🌟 Step-by-Step Method / Procedure */}
                <div className="mb-3 p-2.5 bg-amber-50/50 rounded-lg border border-amber-200">
                  {/* 🌟 한 줄로 표시되는 공정 제목 */}
                  <p className="font-bold text-amber-950 text-[10px] mb-1.5 whitespace-nowrap">
                    ■ 제조 공정 및 만드는 방법 (Procedure) · {isStandardGuide ? '교과서 표준 가이드' : '학생 직접 작성'}
                  </p>

                  {/* 15페이지부터(14단원~20단원)는 표준가이드를 바로 인쇄 */}
                  {isStandardGuide ? (
                    <div className="space-y-1 text-stone-800 text-[10px] leading-relaxed font-sans">
                      {unit.standardSteps.map((step, idx) => (
                        <p key={idx} className="pl-1">
                          {step}
                        </p>
                      ))}
                      {log?.procedureNotes && (
                        <p className="mt-1 pt-1 border-t border-amber-200/80 text-stone-700">
                          <b>실습 추가 메모:</b> {log.procedureNotes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-stone-800 text-[11px] whitespace-pre-wrap leading-relaxed font-sans">
                      {log?.procedureNotes || '(학생 직접 작성란 - 실습 공정 미입력)'}
                    </p>
                  )}
                </div>

                {/* Section 1: Dynamic Process Fields */}
                <div className="mb-3">
                  <p className="font-bold text-stone-900 text-[10px] border-b border-stone-300 pb-0.5 mb-1.5">
                    1. 맞춤 실습 공정 및 측정 기록
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {unit.fields.map((field) => (
                      <div
                        key={field.key}
                        className={`p-1.5 bg-stone-50/70 rounded border border-stone-200 ${
                          field.fullWidth ? 'col-span-2' : ''
                        }`}
                      >
                        <span className="text-[10px] font-bold text-stone-600 block">
                          {field.label} {field.unitSuffix && `(${field.unitSuffix})`}
                        </span>
                        <p className="text-stone-900 mt-0.5 whitespace-pre-wrap leading-relaxed text-[11px]">
                          {log?.dynamicData?.[field.key] || '미입력'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Photo and Self Evaluation */}
                <div className="grid grid-cols-12 gap-3 mb-3">
                  {/* Photo Column */}
                  <div className="col-span-5">
                    <p className="font-bold text-stone-900 text-[10px] border-b border-stone-300 pb-0.5 mb-1.5">
                      2. 완제품 사진
                    </p>
                    <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-stone-300 bg-stone-100 flex items-center justify-center">
                      {log?.photoDataUrl ? (
                        <img
                          src={log.photoDataUrl}
                          alt={`${unit.title} 완제품`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-stone-400">완제품 사진 미등록</span>
                      )}
                    </div>
                  </div>

                  {/* Reflection Column */}
                  <div className="col-span-7">
                    <p className="font-bold text-stone-900 text-[10px] border-b border-stone-300 pb-0.5 mb-1.5">
                      3. 학생 자기평가 (만족도: {log?.satisfaction || 3}/5점)
                    </p>
                    <div className="space-y-1">
                      <div className="p-1.5 bg-stone-50 rounded border border-stone-200">
                        <span className="text-[9px] font-bold text-stone-600 block">오늘의 잘한 점</span>
                        <p className="text-stone-900 text-[10px] leading-relaxed">
                          {log?.strength || '미입력'}
                        </p>
                      </div>
                      <div className="p-1.5 bg-stone-50 rounded border border-stone-200">
                        <span className="text-[9px] font-bold text-stone-600 block">반성할 점</span>
                        <p className="text-stone-900 text-[10px] leading-relaxed">
                          {log?.reflection || '미입력'}
                        </p>
                      </div>
                      <div className="p-1.5 bg-stone-50 rounded border border-stone-200">
                        <span className="text-[9px] font-bold text-stone-600 block">보완할 점</span>
                        <p className="text-stone-900 text-[10px] leading-relaxed">
                          {log?.improvement || '미입력'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Smart Coach Assessment */}
                <div className="border border-stone-300 rounded-lg p-2.5 bg-stone-50">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-1 mb-1.5">
                    <span className="font-bold text-stone-900 text-[10px]">
                      4. 스마트 실습코치 분석 및 피드백
                    </span>
                    <span className="font-bold text-amber-800 text-[10px]">
                      코칭 등급: {log?.coachGrade || '-'} ({log?.coachScore ?? '-'}점)
                    </span>
                  </div>

                  <div className="space-y-1 text-[10px]">
                    {log?.coachFeedback ? (
                      <>
                        <p>
                          <b>👍 강점:</b> {log.coachFeedback.positives.join(' · ')}
                        </p>
                        <p>
                          <b>🔎 원인 추론:</b> {log.coachFeedback.causes.join(' / ')}
                        </p>
                        <p>
                          <b>🎯 다음 미션:</b> {log.coachFeedback.mission}
                        </p>
                      </>
                    ) : (
                      <p className="text-stone-400 italic">스마트 코칭 분석 전 상태입니다.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sheet Bottom Footer */}
              <div className="pt-2 border-t border-stone-300 text-[9px] text-stone-500 flex justify-between items-center">
                <span>부산관광고 B-디저트 실무 20단원 스마트 실습 포트폴리오</span>
                <span>UNIT {unit.code} · 누적 포트폴리오</span>
              </div>
            </article>
          );
        })}

        {/* ================= 4. EPILOGUE SHEET (Only in book modes) ================= */}
        {filterMode !== 'single' && (
          <section className="w-[210mm] min-h-[297mm] p-[16mm] bg-white mx-auto shadow-md border border-stone-300 print:border-none print:shadow-none print-page-break flex flex-col justify-between text-xs">
            <div>
              <div className="border-b-2 border-stone-800 pb-3 mb-6 flex justify-between items-baseline">
                <h2 className="font-serif-kr text-2xl font-bold text-stone-900">
                  포트폴리오 최종 수료 및 종합 총평
                </h2>
                <span className="text-xs text-stone-500 font-mono">PORTFOLIO CONCLUSION</span>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-stone-900 text-sm mb-2 font-serif-kr">
                  1. 20단원 종합 성찰문 (학생 기록)
                </h3>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-800 leading-relaxed font-serif-kr min-h-[140px]">
                  {portfolio.finalSummary?.overallReflection || '작성된 종합 성찰문이 없습니다.'}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-stone-900 text-sm mb-2 font-serif-kr">
                  2. 실습 종합 평가의견
                </h3>
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-stone-800 leading-relaxed min-h-[120px]">
                  {portfolio.finalSummary?.teacherEvaluationNotes ||
                    '실습 전 과정을 충실히 이수하였음을 확인합니다.'}
                </div>
              </div>
            </div>

            {/* Official Certification Footer with Red Stamp */}
            <div className="border-t-2 border-stone-800 pt-6 flex items-center justify-between">
              <div>
                <p className="font-serif-kr text-base font-bold text-stone-900">
                  부산관광고등학교 MICE외식조리과
                </p>
                {/* 🌟 한 줄로 적힌 인증 문구 */}
                <p className="text-xs text-stone-800 mt-1 font-bold whitespace-nowrap">
                  본 포트폴리오는 부산관광고 B-디저트 실무 교육과정에 의거하여 정식 기록되었음을 인증합니다.
                </p>
              </div>

              {/* 🌟 Official Red Stamp: "부산관광고 교사 서은주 확인" */}
              <div
                className="relative w-24 h-24 rounded-full border-2 border-red-600 text-red-600 flex flex-col items-center justify-center font-serif-kr p-1 shrink-0 rotate-[-5deg] select-none bg-red-50/30"
                style={{
                  boxShadow: 'inset 0 0 0 1.5px rgba(220, 38, 38, 0.5)',
                }}
                title="부산관광고 교사 서은주 확인"
              >
                <div className="w-21 h-21 rounded-full border border-red-600/70 flex flex-col items-center justify-center text-center leading-tight">
                  <span className="text-[10px] font-bold tracking-tight">부산관광고</span>
                  <span className="text-[11px] font-black tracking-tight my-0.5">교사 서은주</span>
                  <span className="text-[10px] font-bold text-red-600 tracking-wider">확인 [印]</span>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
