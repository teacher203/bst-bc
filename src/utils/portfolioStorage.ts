import { PortfolioData, UnitLog, StudentProfile } from '../types/portfolio';
import { UNITS_DATA } from '../data/unitsData';

const STORAGE_KEY = 'b_dessert_portfolio_v3';

export const DEFAULT_STUDENT: StudentProfile = {
  studentNo: '',
  studentName: '',
  department: 'MICE외식조리과',
  schoolName: '부산관광고등학교',
  teacherName: '',
  academicYear: '2026학년도',
  portfolioMotto: '',
  coverNotes: '본 포트폴리오는 부산관광고등학교 B-디저트 실무 20단원 전 과정을 성실히 이수하고, 표준 레시피 제조부터 제품 브랜딩 및 품평회까지의 성장 기록을 담은 개인 작품집입니다.',
  coverThemeId: 'camellia-noir',
};

export function createInitialPortfolio(): PortfolioData {
  const units: Record<number, UnitLog> = {};
  const todayStr = new Date().toISOString().split('T')[0];

  // 1단원부터 20단원까지 제조 공정(procedureNotes)은 학생이 직접 작성할 수 있도록 빈 문자열('')로 초기화
  UNITS_DATA.forEach((unit) => {
    units[unit.id] = {
      unitId: unit.id,
      date: todayStr,
      procedureNotes: '', // 학생들이 직접 작성하도록 기본 빈칸 설정
      dynamicData: {},
      satisfaction: 4,
      strength: '',
      reflection: '',
      improvement: '',
      coachGrade: undefined,
      coachScore: undefined,
      isCompleted: false,
      lastUpdated: new Date().toISOString(),
    };
  });

  return {
    version: '3.0.0',
    student: { ...DEFAULT_STUDENT },
    units,
    finalSummary: {
      overallReflection: '부산관광고 B-디저트 실무 20단원을 통해 지역 문화와 특산물을 현대적인 제과 기술로 재해석하는 능력을 길렀습니다. 온도와 시간 등 과학적인 제과 원리를 직접 기록하며 매 실습마다 발전할 수 있었습니다.',
      favoriteUnit: 1,
      skillsMastered: ['정밀 유화 및 거품형성 제어', '로컬 식재료 가공', '패키지 지기구조 설계', '원가 계산 및 표준 레시피 수립'],
      teacherEvaluationNotes: '실습 전 과정을 꼼꼼한 데이터로 기록하고, 특히 공정 실패의 원인을 화학적 원리와 연결하여 분석하는 성찰 역량이 뛰어납니다.',
    },
    bookmarkedPages: [1, 2],
  };
}

export function loadPortfolio(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialPortfolio();
      savePortfolio(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as PortfolioData;

    // 소속을 부산관광고등학교 MICE외식조리과로 강제 동기화 (기존 레거시 값 마이그레이션)
    if (parsed.student) {
      if (!parsed.student.schoolName || parsed.student.schoolName === '베이킹 아카데미') {
        parsed.student.schoolName = '부산관광고등학교';
      }
      if (!parsed.student.department || parsed.student.department === '파티시에 & 외식조리과' || parsed.student.department === '외식조리과') {
        parsed.student.department = 'MICE외식조리과';
      }
    }

    // ensure all 20 units exist
    UNITS_DATA.forEach((u) => {
      if (!parsed.units[u.id]) {
        parsed.units[u.id] = {
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
      }

      // 2026-10 평가정책 변경 이전에 개인 점수만으로 저장된 A등급은
      // 비교집단 상위 4% 확인을 거치지 않았으므로 B 임시등급으로 전환한다.
      const existingLog = parsed.units[u.id];
      if (existingLog?.coachGrade === 'A') {
        existingLog.coachGrade = 'B';
      }
    });
    parsed.version = '3.1.0';
    savePortfolio(parsed);
    return parsed;
  } catch (e) {
    console.error('Failed to load portfolio from localStorage, resetting:', e);
    const initial = createInitialPortfolio();
    savePortfolio(initial);
    return initial;
  }
}

export function savePortfolio(data: PortfolioData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save portfolio to localStorage:', e);
  }
}

export function exportPortfolioAsJSON(data: PortfolioData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `B디저트_포트폴리오_${data.student.studentName || '학생'}_${data.student.studentNo || '학번'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPortfolioAsTxt(data: PortfolioData): void {
  let content = `====================================================
[B-디저트 실무] 20단원 스마트 실습 개인 포트폴리오
학교: 부산관광고등학교 (${data.student.department || 'MICE외식조리과'})
학번: ${data.student.studentNo || '미입력'} | 성명: ${data.student.studentName || '미입력'} | 지도교사: ${data.student.teacherName || '서은주'}
좌우명: ${data.student.portfolioMotto}
====================================================\n\n`;

  UNITS_DATA.forEach((unit) => {
    const log = data.units[unit.id];
    content += `----------------------------------------------------\n`;
    content += `[단원 ${unit.code}] ${unit.title} (${unit.moduleGroup})\n`;
    content += `실습일: ${log?.date || '미입력'} | 완료상태: ${log?.isCompleted ? '완료' : '진행중'}\n`;
    content += `학습목표: ${unit.goal}\n\n`;
    content += `■ 제조 공정 및 만드는 방법 (학생 직접 작성):\n${log?.procedureNotes || '(학생 직접 작성 공정 미입력)'}\n\n`;
    content += `■ 전용 실습 공정 측정 기록:\n`;
    unit.fields.forEach((f) => {
      content += ` - ${f.label}: ${log?.dynamicData?.[f.key] || '미입력'}\n`;
    });
    content += `\n■ 자기평가 (만족도 ${log?.satisfaction || 3}/5):\n`;
    content += ` - 잘한 점: ${log?.strength || '미입력'}\n`;
    content += ` - 반성할 점: ${log?.reflection || '미입력'}\n`;
    content += ` - 보완할 점: ${log?.improvement || '미입력'}\n`;
    if (log?.coachGrade) {
      content += `\n■ 스마트 코치 평가:\n`;
      content += ` - 코칭 등급: ${log.coachGrade}등급 (${log.coachScore}점)\n`;
      content += ` - 다음 실습 미션: ${log.coachFeedback?.mission || '미정'}\n`;
    }
    content += `\n`;
  });

  content += `====================================================\n`;
  content += `총평 및 성찰: ${data.finalSummary?.overallReflection || ''}\n`;
  content += `지도교사 종합 평가: ${data.finalSummary?.teacherEvaluationNotes || ''}\n`;
  content += `인증: 본 포트폴리오는 부산관광고 B-디저트 실무 교육과정에 의거하여 정식 기록되었음을 인증합니다. [부산관광고 교사 서은주]\n`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `부산관광고_B디저트_20단원포트폴리오_${data.student.studentName || '학생'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
