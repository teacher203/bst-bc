import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Send, FileSpreadsheet, AlertCircle, Sparkles } from 'lucide-react';
import { PortfolioData, StudentProfile } from '../types/portfolio';
import { UNITS_DATA } from '../data/unitsData';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  student: StudentProfile;
  onSaveWebhookUrl: (url: string) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  student,
  onSaveWebhookUrl,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(portfolio.googleSheetsWebhookUrl || '');
  const [isSending, setIsSending] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedRow, setCopiedRow] = useState(false);

  if (!isOpen) return null;

  // Google Apps Script sample code for teachers
  const sampleGasCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // 첫 실행 시 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "전송시각", "학번", "학생이름", "소속", "단원코드", "제품명", 
        "실습일자", "제조공정기록", "공정측정기록", "만족도(5점)", 
        "오늘의잘한점", "반성할점", "보완할점", "코칭등급", "코칭점수", "다음실습미션"
      ]);
      sheet.getRange(1, 1, 1, 16).setBackground("#fef3c7").setFontWeight("bold");
    }
    
    // 학생 실습일지 데이터 1행 추가
    sheet.appendRow([
      new Date().toLocaleString("ko-KR"),
      data.studentNo || "",
      data.studentName || "",
      data.department || "부산관광고등학교 MICE외식조리과",
      data.unitCode || "",
      data.unitTitle || "",
      data.date || "",
      data.procedure || "",
      data.processRecord || "",
      data.satisfaction || 0,
      data.strength || "",
      data.reflection || "",
      data.improvement || "",
      data.coachGrade || "-",
      data.coachScore || 0,
      data.mission || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  // Generate TSV row formatted for direct paste into Google Sheets
  const generateTsvData = () => {
    const headers = [
      '학번', '학생이름', '단원', '제품명', '실습일자', '제조공정', '만족도', 
      '잘한점', '반성할점', '보완할점', '코칭등급', '코칭점수', '다음미션'
    ].join('\t');

    const rows = UNITS_DATA.map((u) => {
      const log = portfolio.units[u.id];
      if (!log || !log.date) return null;
      return [
        student.studentNo,
        student.studentName,
        u.code,
        u.title,
        log.date,
        `${log.satisfaction || 3}/5`,
        log.strength || '',
        log.reflection || '',
        log.improvement || '',
        log.coachGrade || '-',
        log.coachScore ?? '',
        log.coachFeedback?.mission || '',
      ].map((cell) => String(cell).replace(/\t|\n/g, ' ')).join('\t');
    }).filter(Boolean);

    return headers + '\n' + rows.join('\n');
  };

  const handleCopyTsv = () => {
    const tsv = generateTsvData();
    navigator.clipboard.writeText(tsv);
    setCopiedRow(true);
    setTimeout(() => setCopiedRow(false), 2500);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(sampleGasCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSaveUrl = () => {
    onSaveWebhookUrl(webhookUrl);
    setSyncStatus('구글 시트 연동 URL이 저장되었습니다.');
    setTimeout(() => setSyncStatus(null), 2500);
  };

  // Test send current completed logs to Webhook
  const handleTestSync = async () => {
    if (!webhookUrl) {
      alert('구글 앱스 스크립트 웹 앱 URL을 먼저 입력해 주세요.');
      return;
    }

    setIsSending(true);
    setSyncStatus('구글 시트로 데이터를 전송 중입니다…');

    try {
      const completedUnits = Object.values(portfolio.units).filter((u) => u.isCompleted);
      const targetUnitId = completedUnits[0]?.unitId || 1;
      const targetUnit = UNITS_DATA.find((u) => u.id === targetUnitId) || UNITS_DATA[0];
      const targetLog = portfolio.units[targetUnit.id];

      const payload = {
        studentNo: student.studentNo,
        studentName: student.studentName,
        department: student.department,
        unitCode: targetUnit.code,
        unitTitle: targetUnit.title,
        date: targetLog?.date || new Date().toISOString().split('T')[0],
        formula: targetLog?.dynamicData?.['formula'] || '',
        processRecord: Object.entries(targetLog?.dynamicData || {})
          .filter(([k]) => k !== 'formula')
          .map(([k, v]) => `${k}: ${v}`)
          .join(', '),
        satisfaction: targetLog?.satisfaction || 4,
        strength: targetLog?.strength || '',
        reflection: targetLog?.reflection || '',
        improvement: targetLog?.improvement || '',
        coachGrade: targetLog?.coachGrade || 'A',
        coachScore: targetLog?.coachScore || 90,
        mission: targetLog?.coachFeedback?.mission || '',
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script Web App standard mode
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSyncStatus('✅ 구글 시트 전송 요청이 성공적으로 완료되었습니다!');
    } catch (e: any) {
      console.error('Google Sheets sync error:', e);
      setSyncStatus('전송 중 오류가 발생했습니다. 브라우저 보안 또는 URL을 확인해 주세요.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-300 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-kr text-xl font-bold text-stone-900">
                구글 스프레드시트 실시간 연동
              </h2>
              <p className="text-xs text-stone-500">
                학생 실습일지 작성 데이터를 교사용 구글 시트에 실시간 1행씩 누적합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: Live Webhook URL Connection */}
        <div className="p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>방법 1. 구글 앱스 스크립트(Web App) 실시간 전송</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
              권장
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            교사가 생성한 구글 스프레드시트의 웹 앱 URL을 등록하면, 학생들이 실습일지에서 <b>[구글 시트 전송]</b>을 누를 때마다 해당 시트에 1행씩 자동 기재됩니다.
          </p>

          <div className="flex gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white text-stone-900 focus:outline-none focus:border-emerald-600"
            />
            <button
              onClick={handleSaveUrl}
              className="px-3 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors shrink-0"
            >
              URL 저장
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTestSync}
              disabled={isSending || !webhookUrl}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                !webhookUrl
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? '전송 중…' : '실습 데이터 테스트 전송'}</span>
            </button>

            {syncStatus && (
              <span className="text-xs text-emerald-700 font-medium animate-pulse">
                {syncStatus}
              </span>
            )}
          </div>
        </div>

        {/* Option 2: Clipboard Paste */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 text-xs sm:text-sm">
              방법 2. 구글 시트에 바로 Ctrl+V 붙여넣기 (클립보드 복사)
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            별도 설정 없이, 현재 학생이 작성한 20단원 기록 전체를 구글 시트 셀 규격(TSV)으로 복사합니다. 구글 시트를 열고 아무 빈 셀에서 <b>Ctrl + V</b>를 누르세요.
          </p>

          <button
            onClick={handleCopyTsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-amber-900 border border-amber-300 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
          >
            {copiedRow ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRow ? '클립보드 복사 완료! (구글 시트에서 붙여넣기)' : '구글 시트 표 데이터 클립보드 복사'}</span>
          </button>
        </div>

        {/* 1-Minute Teacher Guide */}
        <details className="text-xs bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
          <summary className="font-bold text-stone-800 cursor-pointer hover:text-emerald-700">
            📖 [교사용] 1분 만에 구글 시트 웹 앱 URL 만드는 법 보기
          </summary>
          <ol className="list-decimal list-inside space-y-1.5 text-stone-600 pt-2 leading-relaxed">
            <li>Google Drive에서 새 <b>Google 스프레드시트</b>를 만듭니다.</li>
            <li>상단 메뉴에서 <b>확장 프로그램 → Apps Script</b>를 클릭합니다.</li>
            <li>기존 코드를 지우고 아래 제공된 코드를 복사해 붙여넣습니다.</li>
            <li>우측 상단 <b>[배포 → 새 배포]</b>를 누른 후 유형을 <b>[웹 앱]</b>으로 선택합니다.</li>
            <li>액세스 권한을 <b>'모든 사용자(Anyone)'</b>로 선택한 뒤 [배포]를 누릅니다.</li>
            <li>생성된 <b>웹 앱 URL</b>을 복사하여 위의 입력창에 넣으면 연동 완료!</li>
          </ol>

          <div className="pt-2">
            <button
              onClick={handleCopyScript}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 text-stone-100 rounded-lg text-xs font-semibold hover:bg-stone-700"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? '스크립트 코드 복사됨' : 'Apps Script 코드 복사'}</span>
            </button>
          </div>
        </details>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
