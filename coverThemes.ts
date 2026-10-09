export interface CoverTheme {
  id: string;
  name: string;
  bgGradient: string;
  accentColor: string;
  foilColor: string;
  badgeBg: string;
  emblemIcon: string;
  emblemName: string;
  patternType: 'dots' | 'grid' | 'waves' | 'floral' | 'diagonal' | 'stars';
}

export const COVER_THEMES: CoverTheme[] = [
  {
    id: 'camellia-noir',
    name: '카멜리아 블랙 & 골드',
    bgGradient: 'from-stone-950 via-stone-900 to-amber-950',
    accentColor: '#d97706',
    foilColor: '#fbbf24',
    badgeBg: 'bg-amber-500/20 text-amber-300',
    emblemIcon: '🧁',
    emblemName: '동백꽃 마들렌 엠블럼',
    patternType: 'floral',
  },
  {
    id: 'coastal-ocean',
    name: '코스탈 오션 & 실버',
    bgGradient: 'from-slate-950 via-cyan-950 to-blue-900',
    accentColor: '#0ea5e9',
    foilColor: '#7dd3fc',
    badgeBg: 'bg-cyan-500/20 text-cyan-300',
    emblemIcon: '🌊',
    emblemName: '바다결 버터쿠키 엠블럼',
    patternType: 'waves',
  },
  {
    id: 'rose-patisserie',
    name: '로즈 로맨틱 & 핑크',
    bgGradient: 'from-stone-950 via-rose-950 to-pink-900',
    accentColor: '#e11d48',
    foilColor: '#fda4af',
    badgeBg: 'bg-rose-500/20 text-rose-300',
    emblemIcon: '🌸',
    emblemName: '로즈 블라썸 엠블럼',
    patternType: 'floral',
  },
  {
    id: 'matcha-botanical',
    name: '말차 보태니컬 & 에메랄드',
    bgGradient: 'from-stone-950 via-emerald-950 to-teal-900',
    accentColor: '#059669',
    foilColor: '#6ee7b7',
    badgeBg: 'bg-emerald-500/20 text-emerald-300',
    emblemIcon: '🌿',
    emblemName: '보태니컬 허브 엠블럼',
    patternType: 'dots',
  },
  {
    id: 'chocolat-royale',
    name: '쇼콜라 로열 & 브론즈',
    bgGradient: 'from-amber-950 via-stone-950 to-stone-900',
    accentColor: '#b45309',
    foilColor: '#fcd34d',
    badgeBg: 'bg-amber-600/20 text-amber-200',
    emblemIcon: '🍫',
    emblemName: '쇼콜라티에 엠블럼',
    patternType: 'grid',
  },
  {
    id: 'lavender-twilight',
    name: '라벤더 트와일라잇 & 바이올렛',
    bgGradient: 'from-stone-950 via-purple-950 to-indigo-950',
    accentColor: '#9333ea',
    foilColor: '#d8b4fe',
    badgeBg: 'bg-purple-500/20 text-purple-300',
    emblemIcon: '✨',
    emblemName: '트와일라잇 스타 엠블럼',
    patternType: 'stars',
  },
  {
    id: 'travertine-classic',
    name: '트래버틴 앤틱 & 황동',
    bgGradient: 'from-stone-900 via-stone-850 to-amber-900',
    accentColor: '#ca8a04',
    foilColor: '#fef08a',
    badgeBg: 'bg-yellow-500/20 text-yellow-300',
    emblemIcon: '🥐',
    emblemName: '크루아상 아틀리에 엠블럼',
    patternType: 'diagonal',
  },
  {
    id: 'sunset-citrus',
    name: '선셋 시트러스 & 탠저린',
    bgGradient: 'from-stone-950 via-orange-950 to-amber-900',
    accentColor: '#ea580c',
    foilColor: '#fdba74',
    badgeBg: 'bg-orange-500/20 text-orange-300',
    emblemIcon: '🍊',
    emblemName: '시트러스 블렌드 엠블럼',
    patternType: 'waves',
  },
  {
    id: 'aurora-pearl',
    name: '오로라 펄 & 플래티넘',
    bgGradient: 'from-slate-900 via-teal-950 to-cyan-950',
    accentColor: '#14b8a6',
    foilColor: '#99f6e4',
    badgeBg: 'bg-teal-500/20 text-teal-300',
    emblemIcon: '🏝️',
    emblemName: '오륙도 아일랜드 엠블럼',
    patternType: 'stars',
  },
  {
    id: 'berry-velvet',
    name: '베리 벨벳 & 크림슨',
    bgGradient: 'from-neutral-950 via-rose-950 to-red-950',
    accentColor: '#be123c',
    foilColor: '#fecdd3',
    badgeBg: 'bg-rose-500/20 text-rose-300',
    emblemIcon: '🍓',
    emblemName: '스트로베리 가니시 엠블럼',
    patternType: 'floral',
  },
  {
    id: 'midnight-sapphire',
    name: '미드나잇 사파이어 & 코발트',
    bgGradient: 'from-stone-950 via-blue-950 to-indigo-950',
    accentColor: '#2563eb',
    foilColor: '#93c5fd',
    badgeBg: 'bg-blue-500/20 text-blue-300',
    emblemIcon: '🌉',
    emblemName: '다이아몬드 브릿지 엠블럼',
    patternType: 'grid',
  },
  {
    id: 'vintage-copper',
    name: '빈티지 코퍼 & 테라코타',
    bgGradient: 'from-stone-950 via-stone-900 to-amber-950',
    accentColor: '#c2410c',
    foilColor: '#fed7aa',
    badgeBg: 'bg-amber-600/20 text-amber-300',
    emblemIcon: '🏷️',
    emblemName: '파티시에 씰 엠블럼',
    patternType: 'diagonal',
  },
];

// Hash function to pick a deterministic unique theme based on student ID and Name
export function getStudentCoverTheme(studentNo: string, studentName: string, selectedThemeId?: string): CoverTheme {
  if (selectedThemeId) {
    const found = COVER_THEMES.find((t) => t.id === selectedThemeId);
    if (found) return found;
  }

  // Hash studentNo + studentName to 0..(COVER_THEMES.length - 1)
  const seed = `${studentNo}_${studentName}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % COVER_THEMES.length;
  return COVER_THEMES[index];
}
