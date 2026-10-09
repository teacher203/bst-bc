import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  Circle,
  Sparkles,
  Printer,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileSpreadsheet,
  ListOrdered,
  RotateCcw,
  BookOpen,
  Trash2,
  Check,
} from 'lucide-react';
import { UnitDefinition, UnitLog, StudentProfile } from '../types/portfolio';
import { evaluateStudentLog, CoachEvaluationResult } from '../utils/coachEngine';
import { FlapCard } from './FlapCard';
import { InteractiveUnitWidget } from './unit-widgets/InteractiveUnitWidget';

interface UnitPageProps {
  unit: UnitDefinition;
  log: UnitLog;
  student: StudentProfile;
  onUpdateLog: (updated: Partial<UnitLog>) => void;
  onPrevUnit?: () => void;
  onNextUnit?: () => void;
  onPrintThisPage: () => void;
  onOpenGoogleSheetsModal: () => void;
  isFirstUnit: boolean;
  isLastUnit: boolean;
  googleSheetsWebhookUrl?: string;
  spreadSide?: 'left' | 'right' | 'full';
}

export const UnitPage: React.FC<UnitPageProps> = ({
  unit,
  log,
  student,
  onUpdateLog,
  onPrevUnit,
  onNextUnit,
  onPrintThisPage,
  onOpenGoogleSheetsModal,
  isFirstUnit,
  isLastUnit,
  googleSheetsWebhookUrl,
  spreadSide = 'full',
}) => {
  const [isCoaching, setIsCoaching] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [sheetSyncSuccess, setSheetSyncSuccess] = useState(false);

  // 15페이지부터 마지막 단원(단원 14~20)은 표준 가이드를 기본으로 바로 보여줌
  const isStandardGuideMode = unit.id >= 14;
  const [showStandardSteps, setShowStandardSteps] = useState(isStandardGuideMode);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (key: string, value: string) => {
    onUpdateLog({
      dynamicData: {
        ...log.dynamicData,
        [key]: value,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateLog({
        photoDataUrl: reader.result as string,
        photoName: file.name,
        lastUpdated: new Date().toISOString(),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRunCoach = () => {
    setIsCoaching(true);
    setTimeout(() => {
      const evaluation: CoachEvaluationResult = evaluateStudentLog(
        unit,
        log.dynamicData,
        log.satisfaction,
        log.strength,
        log.reflection,
        log.improvement,
        isStandardGuideMode ? (log.procedureNotes || unit.standardSteps.join('\n')) : log.procedureNotes
      );

      onUpdateLog({
        coachGrade: evaluation.grade,
        coachScore: evaluation.score,
        coachMetrics: evaluation.metrics,
        coachFeedback: evaluation.feedback,
        lastUpdated: new Date().toISOString(),
      });
      setIsCoaching(false);
    }, 500);
  };

  const handleToggleComplete = () => {
    onUpdateLog({
      isCompleted: !log.isCompleted,
      lastUpdated: new Date().toISOString(),
    });
  };

  // 학생이 표준 레시피를 바탕으로 수정하여 작성할 수 있도록 템플릿 불러오기
  const handleLoadStandardTemplate = () => {
    const confirmLoad = window.confirm(
      '교과서 표준 공정 텍스트를 불러와 나만의 실습 조작법으로 수정하여 작성하시겠습니까?\n(기존 입력 내용이 있는 경우 대체됩니다)'
    );
    if (!confirmLoad) return;

    onUpdateLog({
      procedureNotes: unit.standardSteps.join('\n'),
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleClearProcedureNotes = () => {
    if ((log.procedureNotes || '').trim().length > 0) {
      const confirmClear = window.confirm('작성 중인 제조 공정 내용을 모두 지우시겠습니까?');
      if (!confirmClear) return;
    }
    onUpdateLog({
      procedureNotes: '',
      lastUpdated: new Date().toISOString(),
    });
  };

  // Direct send to Google Sheets
  const handleDirectSheetSend = async () => {
    if (!googleSheetsWebhookUrl) {
      onOpenGoogleSheetsModal();
      return;
    }

    setIsSyncingSheet(true);
    try {
      const payload = {
        studentNo: student.studentNo,
        studentName: student.studentName,
        department: '부산관광고등학교 MICE외식조리과',
        unitCode: unit.code,
        unitTitle: unit.title,
        date: log.date || new Date().toISOString().split('T')[0],
        formula: log.dynamicData['formula'] || '',
        procedure: isStandardGuideMode
          ? (log.procedureNotes || unit.standardSteps.join(' / '))
          : (log.procedureNotes || ''),
        processRecord: Object.entries(log.dynamicData)
          .filter(([k]) => k !== 'formula')
          .map(([k, v]) => `${k}: ${v}`)
          .join(', '),
        satisfaction: log.satisfaction || 4,
        strength: log.strength || '',
        reflection: log.reflection || '',
        improvement: log.improvement || '',
        coachGrade: log.coachGrade || 'E',
        coachScore: log.coachScore || 0,
        mission: log.coachFeedback?.mission || '',
      };

      const response = await fetch(googleSheetsWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      const ranking = await response.json().catch(() => null);

      onUpdateLog({
        ...(ranking?.grade ? { coachGrade: ranking.grade } : {}),
        syncedToGoogleSheets: true,
        syncedAt: new Date().toISOString(),
      });

      setSheetSyncSuccess(true);
      setTimeout(() => setSheetSyncSuccess(false), 3000);
    } catch (e) {
      console.error('Direct sheet sync error:', e);
      onOpenGoogleSheetsModal();
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const hasWrittenProcedure = (log.procedureNotes || '').trim().length > 0;
  const showLeftPage = spreadSide !== 'right';
  const showRightPage = spreadSide !== 'left';

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      {/* Editorial Workbook Sheet with book-leaf styling */}
      <article className="bg-white rounded-2xl border border-stone-300 shadow-xl overflow-hidden book-page-leaf">
        
        {/* Top Header of the Page */}
        <div
          className="p-6 sm:p-8 border-b border-stone-200 transition-colors"
          style={{ backgroundColor: unit.softHex }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs border border-white shrink-0"
                style={{ backgroundColor: '#ffffff' }}
              >
                {unit.icon}
              </span>
              <div className="min-w-0">
                <span className="text-xs font-mono font-bold tracking-wider text-stone-500 uppercase block truncate">
                  {unit.moduleGroup} · UNIT {unit.code}
                </span>
                {/* 🌟 단원과 단원명이 항상 한 줄로 깔끔하게 표시됨 */}
                <h1 className="font-serif-kr text-xl sm:text-2xl md:text-3xl font-black text-stone-900 tracking-tight whitespace-nowrap">
                  {unit.code}단원 · {unit.title}
                </h1>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={handleDirectSheetSend}
                disabled={isSyncingSheet}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs"
                title="이 단원의 실습기록을 구글 시트로 실시간 전송"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>
                  {sheetSyncSuccess
                    ? '시트 전송 완료!'
                    : isSyncingSheet
                    ? '전송 중…'
                    : '구글 시트 전송'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleToggleComplete}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                  log.isCompleted
                    ? 'bg-teal-700 text-white hover:bg-teal-800'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                }`}
              >
                {log.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-200" />
                    <span>실습 완료 도장</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5 text-stone-400" />
                    <span>완료 체크</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onPrintThisPage}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-stone-700 border border-stone-300 hover:bg-stone-100 transition-colors"
                title="이 단원 단일 A4 보고서 인쇄"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>단원 A4 인쇄</span>
              </button>
            </div>
          </div>

          {/* Student info and learning goal belong to the first page of the spread. */}
          {showLeftPage && (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/90 p-3 rounded-xl border border-stone-200/80 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>
                <b>작성자:</b> {student.studentName || '성명 미입력'} ({student.studentNo || '학번 미입력'}) · 부산관광고등학교
              </span>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <label htmlFor="unitDateInput" className="font-semibold text-stone-600">실습일:</label>
              <input
                id="unitDateInput"
                type="date"
                value={log.date || ''}
                onChange={(e) => onUpdateLog({ date: e.target.value })}
                className="bg-transparent border-b border-stone-300 focus:outline-none focus:border-stone-600 text-stone-900"
              />
            </div>
          </div>

          {/* Learning Goal Banner */}
          <div className="mt-4 p-3.5 bg-white/90 rounded-xl border border-stone-200/80 text-xs sm:text-sm">
            <p className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>단원 학습 목표</span>
            </p>
            <p className="text-stone-700 leading-relaxed pl-3 font-serif-kr">
              {unit.goal}
            </p>
          </div>
          </>
          )}

          {spreadSide === 'right' && (
            <div className="mt-3 px-3 py-2 bg-white/90 rounded-xl border border-stone-200/80 text-xs text-stone-600">
              <b className="text-stone-900">실습 기록 · 자기평가 · 스마트 코칭</b>
              <span className="ml-2">왼쪽 페이지의 제조 공정과 완제품을 바탕으로 기록하세요.</span>
            </div>
          )}
        </div>

        {/* Page Content Body */}
        <div className="p-6 sm:p-8 space-y-8">

          {showLeftPage && (
          <>

          {/* 🌟 Flapbook Special Liftable Flap Card */}
          <FlapCard
            title={unit.flapTitle}
            hint={unit.flapHint}
            content={unit.flapContent}
            unitColor={unit.themeColor}
          />

          {/* 🌟 Specialized Interactive Unit Widget (if available) */}
          <InteractiveUnitWidget
            unitId={unit.id}
            onApplyData={(key, val) => handleFieldChange(key, val)}
          />

          {/* 🌟 Section: 제조 공정 및 만드는 방법 (Procedure) */}
          <section className="space-y-4 p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-300/80 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-amber-200 pb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-amber-800 shrink-0" />
                  {/* 🌟 제목이 한 줄로 시원하게 보이도록 whitespace-nowrap 적용 */}
                  <h2 className="font-serif-kr text-sm sm:text-base md:text-lg font-bold text-stone-900 whitespace-nowrap">
                    {isStandardGuideMode
                      ? '제조 공정 및 만드는 방법 (Procedure) · 교과서 표준 가이드'
                      : '제조 공정 및 만드는 방법 (Procedure) · 학생 직접 작성'}
                  </h2>
                </div>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  {isStandardGuideMode
                    ? '※ 14단원(15페이지)부터는 교과서 표준 실무 공정 가이드가 바로 제공되어 직관적으로 학습합니다.'
                    : '※ 1단원~13단원은 핵심 제과 공정을 학생들이 자신의 언어로 직접 단계별로 작성하여 학습합니다.'}
                </p>
              </div>

              {/* Action Buttons & Status */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {isStandardGuideMode ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-300 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>표준 실무 가이드 자동 적용</span>
                  </span>
                ) : (
                  <>
                    {hasWrittenProcedure ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✅ 공정 작성 완료 ({(log.procedureNotes || '').length}자)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-400 animate-pulse">
                        ⚠️ 직접 작성 필요
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowStandardSteps(!showStandardSteps)}
                      className="text-xs text-amber-900 font-medium hover:underline inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-amber-300"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      <span>{showStandardSteps ? '가이드 닫기' : '표준 가이드 참고'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLoadStandardTemplate}
                      className="text-xs text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-stone-300"
                      title="표준 레시피 텍스트를 불러와 나만의 표현으로 수정"
                    >
                      <RotateCcw className="w-3 h-3 text-stone-500" />
                      <span>템플릿 가져오기</span>
                    </button>

                    {hasWrittenProcedure && (
                      <button
                        type="button"
                        onClick={handleClearProcedureNotes}
                        className="text-xs text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50"
                        title="작성 내용 지우기"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>지우기</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 🌟 15페이지부터(14단원~20단원): 교과서 표준가이드를 바로 보여줌 */}
            {isStandardGuideMode ? (
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-amber-300 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <p className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-700" />
                      <span>📖 {unit.title} 교과서 표준 공정 및 실무 가이드 순서</span>
                    </p>
                    <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      표준 매뉴얼
                    </span>
                  </div>

                  <div className="space-y-2 pt-1 text-xs text-stone-800 leading-relaxed font-sans">
                    {unit.standardSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="font-medium text-stone-900 leading-relaxed">
                          {step.replace(/^\d+\.\s*/, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 선택적 학생 실습 추가 메모란 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-stone-700">
                      실습 추가 조작 메모 및 특이사항 (선택 입력)
                    </label>
                    <span className="text-stone-400 font-mono text-[11px]">
                      {(log.procedureNotes || '').length}자
                    </span>
                  </div>
                  <textarea
                    value={log.procedureNotes || ''}
                    onChange={(e) =>
                      onUpdateLog({
                        procedureNotes: e.target.value,
                        lastUpdated: new Date().toISOString(),
                      })
                    }
                    rows={3}
                    placeholder="표준 가이드 외에 오늘 본인 조에서 변경하거나 추가로 관찰한 특이사항이 있다면 자유롭게 기록하세요."
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-600 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              /* 1단원~13단원: 학생 본인 실습 제조 공정 직접 서술 */
              <div className="space-y-3">
                {/* Standard Step-by-Step Reference Box (Toggleable reference guide for Units 1~13) */}
                {showStandardSteps && (
                  <div className="p-4 bg-white rounded-xl border border-amber-300 text-xs text-stone-700 space-y-2 leading-relaxed shadow-xs">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span>📖 {unit.title} 교과서 표준 공정 참고 가이드</span>
                      </p>
                      <span className="text-[11px] text-stone-500">참고 후 아래에 직접 작성하세요</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {unit.standardSteps.map((step, idx) => (
                        <p key={idx} className="pl-1 text-stone-800">
                          {step}
                        </p>
                      ))}
                    </div>
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                      💡 <b>학습 안내:</b> 위 표준 공정의 단계별 흐름을 숙지하고, 실제 실습에서 본인이 조작한 반죽 온도, 믹싱 시간, 휴지 상태, 오븐 굽기 조건 및 특이사항을 아래 작성란에 직접 서술하세요.
                    </p>
                  </div>
                )}

                {/* Student's Custom Procedure Notes Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-stone-800">
                      학생 본인 실습 제조 공정 및 세부 조작 기록 (직접 서술)
                    </label>
                    <span className="text-stone-500 font-mono text-[11px]">
                      {(log.procedureNotes || '').length}자 입력됨
                    </span>
                  </div>
                  <textarea
                    value={log.procedureNotes || ''}
                    onChange={(e) =>
                      onUpdateLog({
                        procedureNotes: e.target.value,
                        lastUpdated: new Date().toISOString(),
                      })
                    }
                    rows={7}
                    placeholder={`[학생 직접 작성 예시]\n1단계 (계량 및 준비): \n2단계 (믹싱 및 유화): \n3단계 (휴지 및 성형): \n4단계 (팬닝 및 굽기): \n5단계 (마무리 및 냉각): \n\n※ 오늘 실습한 제조 순서와 자신이 주의했던 핵심 공정 조작법을 상세히 직접 기록하세요.`}
                    className="w-full px-3.5 py-3 text-xs sm:text-sm bg-white border border-amber-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 font-sans leading-relaxed shadow-2xs"
                  />
                </div>
              </div>
            )}
          </section>
          
          {/* Section 1: 완제품 사진 기록 (2 distinct modes: File Upload & Camera Capture) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-kr text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>① 완제품 관찰 및 사진 기록</span>
              </h2>
              <span className="text-xs text-stone-500">파일 올리기 및 카메라 바로 촬영 지원</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Photo Upload Dropzone */}
              <div className="md:col-span-5 border-2 border-dashed border-stone-300 rounded-xl p-4 bg-stone-50/70 text-center flex flex-col items-center justify-center min-h-[230px]">
                {log.photoDataUrl ? (
                  <div className="space-y-3 w-full">
                    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-stone-200 bg-stone-900 shadow-sm">
                      <img
                        src={log.photoDataUrl}
                        alt="학생 실습 완제품"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                      <span className="truncate max-w-[150px]">{log.photoName || '완제품 사진'}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateLog({ photoDataUrl: undefined, photoName: undefined })}
                        className="text-rose-600 hover:underline font-semibold"
                      >
                        사진 지우기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 w-full">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">완제품 사진을 등록해 주세요</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">상황에 맞는 편리한 방식을 선택하세요</p>
                    </div>

                    {/* TWO EXPLICIT MODES: FILE UPLOAD & DIRECT CAMERA */}
                    <div className="flex flex-col sm:flex-row gap-2 justify-center w-full max-w-xs mx-auto pt-1">
                      {/* Mode 1: File Upload */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>📁 파일 올리기</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />

                      {/* Mode 2: Camera Capture */}
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>📷 사진 찍기</span>
                      </button>
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Guide & Observation Hints */}
              <div className="md:col-span-7 bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3 text-xs">
                <div>
                  <p className="font-bold text-stone-800 flex items-center gap-1.5 mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>단원별 사진 촬영 및 관찰 가이드</span>
                  </p>
                  <p className="text-stone-600 leading-relaxed">
                    {unit.photoGuide}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-200">
                  <p className="font-semibold text-stone-700 mb-1">핵심 관찰 질문</p>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    {unit.keyQuestions.map((q, idx) => (
                      <li key={idx} className="leading-relaxed">{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          </>
          )}

          {/* Section 2: 단원별 맞춤 공정 측정 기록 */}
          {showRightPage && (
          <>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-kr text-base sm:text-lg font-bold text-stone-900 whitespace-nowrap">
                ② {unit.code}단원 전용 정량 공정 측정 기록
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {unit.fields.length}개 핵심 측정 항목
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {unit.brief}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unit.fields.map((field) => {
                const val = log.dynamicData[field.key] || '';
                return (
                  <div
                    key={field.key}
                    className={`space-y-1.5 ${field.fullWidth ? 'sm:col-span-2' : ''}`}
                  >
                    <label className="block text-xs font-bold text-stone-700">
                      {field.label}
                      {field.unitSuffix && (
                        <span className="text-stone-400 font-normal ml-1">
                          ({field.unitSuffix})
                        </span>
                      )}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={val}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={val}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                      >
                        <option value="">선택하세요</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={val}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          </>
          )}

          {/* Section 3: 학생 자기평가 */}
          {((showLeftPage && unit.id <= 13) || (showRightPage && unit.id >= 14)) && (
          <section className="space-y-3">
            <h2 className="font-serif-kr text-base sm:text-lg font-bold text-stone-900">
              ③ 학생 자기평가 &amp; 성찰 기록
            </h2>
            <p className="text-xs text-stone-600">
              만족도를 선택한 뒤 잘한 점·반성할 점·보완할 점을 구체적으로 기록하면 스마트 코치가 A~E 등급과 개선 미션을 제시합니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* Satisfaction Slider */}
              <div className="md:col-span-4 p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-center text-center">
                <span className="text-xs font-semibold text-stone-600">오늘 제품 만족도</span>
                <div className="my-2 text-3xl font-black text-amber-700">
                  {log.satisfaction} <span className="text-sm font-normal text-stone-400">/ 5점</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={log.satisfaction}
                  onChange={(e) =>
                    onUpdateLog({
                      satisfaction: Number(e.target.value),
                      lastUpdated: new Date().toISOString(),
                    })
                  }
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <p className="text-[11px] text-stone-500 mt-2">
                  만족도는 학생의 주관적 체감 점수이며, 최종 코칭 등급은 정밀 공정 데이터와 성찰 깊이를 합산합니다.
                </p>
              </div>

              {/* Reflection Questions */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    오늘의 잘한 점
                  </label>
                  <textarea
                    value={log.strength}
                    onChange={(e) =>
                      onUpdateLog({
                        strength: e.target.value,
                        lastUpdated: new Date().toISOString(),
                      })
                    }
                    placeholder="예: 버터와 달걀 온도를 맞춰 유화 분리 없이 반죽을 완성함."
                    rows={4}
                    className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    반성할 점 (원인)
                  </label>
                  <textarea
                    value={log.reflection}
                    onChange={(e) =>
                      onUpdateLog({
                        reflection: e.target.value,
                        lastUpdated: new Date().toISOString(),
                      })
                    }
                    placeholder="예: 팬닝량이 균일하지 않아 오븐 속 구움색과 크기가 달라짐."
                    rows={4}
                    className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    보완할 점 (다음 행동)
                  </label>
                  <textarea
                    value={log.improvement}
                    onChange={(e) =>
                      onUpdateLog({
                        improvement: e.target.value,
                        lastUpdated: new Date().toISOString(),
                      })
                    }
                    placeholder="예: 다음 실습 시 팬닝 저울을 준비해 32g씩 정확히 분할하겠음."
                    rows={4}
                    className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>
            </div>
          </section>
          )}

          {/* Section 4: 교과서 기반 스마트 실습코치 */}
          {showRightPage && (
          <>
          <section className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-stone-50 to-amber-50/40 border border-stone-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  👩‍🍳
                </span>
                <div>
                  <h3 className="font-serif-kr text-sm sm:text-base font-bold text-stone-900">
                    B-디저트 교과서 스마트 실습코치
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    기록 데이터를 분석하여 원인 탐구와 다음 실습 미션을 코칭합니다.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunCoach}
                disabled={isCoaching}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-amber-300 hover:bg-stone-800 text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isCoaching ? '코칭 분석 중…' : '✨ 스마트 코칭 받기'}</span>
              </button>
            </div>

            {/* Coach Output */}
            {log.coachGrade ? (
              <div className="space-y-4 pt-1">
                {/* Grade and Metrics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                  <div className="sm:col-span-3 text-center sm:border-r sm:border-stone-200 sm:pr-3">
                    <span className="text-[11px] text-stone-400 uppercase font-semibold block">코칭 종합 등급</span>
                    <div className="text-3xl font-black text-amber-700 my-0.5">
                      {log.coachGrade} <span className="text-sm font-semibold text-stone-600">등급</span>
                    </div>
                    <span className="text-xs text-stone-500 font-mono">
                      총점 {log.coachScore}점 / 100
                    </span>
                    <p className="mt-1 text-[10px] leading-relaxed text-stone-500">
                      B~E는 개인 임시등급이며, A는 동일 단원 전체 제출자의 4%(소수점 올림)만 확정됩니다. 20명 기준 1명입니다.
                    </p>
                  </div>

                  <div className="sm:col-span-9 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-stone-600">
                      <span>공정 정밀 기록 (35%)</span>
                      <span className="font-mono font-bold text-stone-800">{log.coachMetrics?.process || 0}점</span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span>완제품 결과·성공/실패 근거 (35%)</span>
                      <span className="font-mono font-bold text-stone-800">{log.coachMetrics?.outcome || 0}점</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600 rounded-full" style={{ width: `${log.coachMetrics?.outcome || 0}%` }} />
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${log.coachMetrics?.process || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span>원인 추론 분석 (20%)</span>
                      <span className="font-mono font-bold text-stone-800">{log.coachMetrics?.cause || 0}점</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full"
                        style={{ width: `${log.coachMetrics?.cause || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span>자기 성찰·다음 행동 (10%)</span>
                      <span className="font-mono font-bold text-stone-800">{log.coachMetrics?.reflection || 0}점</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600 rounded-full"
                        style={{ width: `${log.coachMetrics?.reflection || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Structured Commentary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                    <p className="font-bold text-teal-800 mb-1 flex items-center gap-1">
                      <span>👍 잘한 점</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-stone-700">
                      {log.coachFeedback?.positives.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                    <p className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                      <span>🔎 교과서 기준으로 살펴볼 원인</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-stone-700">
                      {log.coachFeedback?.causes.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Coach Question & Next Mission */}
                <div className="p-4 bg-amber-100/60 rounded-xl border border-amber-200 text-xs space-y-2">
                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">
                      💬 코치의 핵심 질문
                    </span>
                    <p className="text-stone-800 italic leading-relaxed">
                      {log.coachFeedback?.question}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-amber-200/80">
                    <span className="font-bold text-amber-900 block mb-0.5">
                      🎯 다음 실습 1순위 행동 미션
                    </span>
                    <p className="text-stone-900 font-medium leading-relaxed">
                      {log.coachFeedback?.mission}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-stone-500 text-xs">
                제조 공정과 실습 기록, 자기평가를 작성한 후 [✨ 스마트 코칭 받기]를 누르면 교과서 기반 코칭 결과가 생성됩니다.
              </div>
            )}
          </section>

          <section className="p-5 sm:p-6 rounded-2xl bg-sky-50 border border-sky-200 space-y-3 print-avoid-break">
            <h3 className="font-serif-kr text-base font-bold text-stone-900">④ 저장 · A4 내려받기 · Google Classroom 제출</h3>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
              <li className="p-3 bg-white rounded-xl border border-sky-100"><b className="block text-sky-800 mb-1">1. 기록 저장</b>입력 내용은 이 기기에 자동 저장됩니다. 스마트 코칭 결과까지 확인하세요.</li>
              <li className="p-3 bg-white rounded-xl border border-sky-100"><b className="block text-sky-800 mb-1">2. A4 내려받기</b>상단의 [단원 A4 인쇄]를 눌러 인쇄 창에서 [PDF로 저장]을 선택하세요.</li>
              <li className="p-3 bg-white rounded-xl border border-sky-100"><b className="block text-sky-800 mb-1">3. Classroom 제출</b>Google Classroom 과제에서 [추가 또는 만들기] → [파일] → 저장한 PDF 선택 → [제출]을 누르세요.</li>
            </ol>
          </section>

          </>
          )}

        </div>

        {/* Bottom Page Navigation within Unit */}
        {showRightPage && (
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={onPrevUnit}
            disabled={isFirstUnit}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
              isFirstUnit
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="whitespace-nowrap">이전 단원 ({isFirstUnit ? '-' : `${String(unit.id - 1).padStart(2, '0')}단원`})</span>
          </button>

          {/* 🌟 한 줄로 표시되는 단원명 */}
          <span className="text-stone-600 font-bold whitespace-nowrap">
            {unit.code}단원 · {unit.title}
          </span>

          <button
            type="button"
            onClick={onNextUnit}
            disabled={isLastUnit}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
              isLastUnit
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            <span className="whitespace-nowrap">다음 단원 ({isLastUnit ? '-' : `${String(unit.id + 1).padStart(2, '0')}단원`})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        )}

      </article>
      <footer className="py-5 text-center text-[11px] text-stone-500">
        부산관광고등학교 MICE외식조리과
      </footer>
    </div>
  );
};
