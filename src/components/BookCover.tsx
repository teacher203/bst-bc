import React, { useState } from 'react';
import { BookOpen, User, Sparkles, ChevronRight, Edit3, Check, UserPlus, FileSpreadsheet, Palette, Upload, RotateCcw } from 'lucide-react';
import { StudentProfile } from '../types/portfolio';
import { COVER_THEMES, getStudentCoverTheme } from '../utils/coverThemes';

interface BookCoverProps {
  student: StudentProfile;
  onUpdateStudent: (profile: Partial<StudentProfile>) => void;
  onOpenBook: () => void;
  onViewToc: () => void;
  onNewStudent: () => void;
  onOpenGoogleSheets: () => void;
  completedCount: number;
  spreadSide?: 'left' | 'right' | 'full';
}

const MOTTO_EXAMPLE = '식재료의 본질과 정밀한 제과 테크닉으로 완성하는 나만의 디저트 포트폴리오';

export const BookCover: React.FC<BookCoverProps> = ({
  student,
  onUpdateStudent,
  onOpenBook,
  onViewToc,
  onNewStudent,
  onOpenGoogleSheets,
  completedCount,
  spreadSide = 'full',
}) => {
  const [isDetailEditing, setIsDetailEditing] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [formData, setFormData] = useState(student);

  // Active theme based on student ID, name, or explicit theme
  const currentTheme = getStudentCoverTheme(student.studentNo, student.studentName, student.coverThemeId);
  const showImagePage = spreadSide !== 'right';
  const showInfoPage = spreadSide !== 'left';

  const handleSaveDetail = () => {
    onUpdateStudent({
      studentNo: formData.studentNo,
      studentName: formData.studentName,
      teacherName: formData.teacherName,
      portfolioMotto: formData.portfolioMotto,
      coverNotes: formData.coverNotes,
      schoolName: '부산관광고등학교',
      department: 'MICE외식조리과',
    });
    setIsDetailEditing(false);
  };

  const handleCustomCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdateStudent({ customCoverImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleApplyMottoExample = () => {
    onUpdateStudent({ portfolioMotto: MOTTO_EXAMPLE });
    setFormData((prev) => ({ ...prev, portfolioMotto: MOTTO_EXAMPLE }));
  };

  const handleClearMotto = () => {
    onUpdateStudent({ portfolioMotto: '' });
    setFormData((prev) => ({ ...prev, portfolioMotto: '' }));
  };

  return (
    <div className="min-h-[calc(100vh-3.75rem)] flex items-center justify-center p-4 sm:p-8 bg-stone-200/80">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-300 book-spine-shadow flex flex-col md:flex-row transition-all duration-300">
        
        {/* Book Left/Spine Visual Banner with Selected Theme Gradient */}
        {showImagePage && (
        <div className={`${spreadSide === 'full' ? 'md:w-5/12' : 'w-full'} bg-gradient-to-br ${currentTheme.bgGradient} text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden`}>
          {/* Subtle decorative background pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Stamp / Badge - 부산관광고등학교 MICE외식조리과 */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-amber-200 font-semibold whitespace-nowrap">
                부산관광고등학교
              </p>
              <p className="text-xs text-stone-200 font-medium mt-0.5 whitespace-nowrap">
                MICE외식조리과
              </p>
            </div>
            <div className="text-2xl" aria-hidden="true">
              {currentTheme.emblemIcon}
            </div>
          </div>

          {/* Book Cover Image Container (표지 위 MAREE 옆 중복 컵케이크 엠블럼 삭제 완료) */}
          <div className="relative z-10 my-6 group">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-2xl border-2 border-white/30 bg-stone-950 flex items-center justify-center">
              {student.customCoverImage ? (
                <img
                  src={student.customCoverImage}
                  alt="나만의 맞춤 책 표지"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src="/images/cover.jpg"
                    alt="B-디저트 실무 책 표지"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Theme Color Wash Overlay */}
                  <div
                    className="absolute inset-0 mix-blend-color opacity-40 pointer-events-none"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-black/25" />

                  {/* Student Signature Badge at Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <span className="text-[10px] tracking-wider text-amber-200 uppercase font-mono block whitespace-nowrap">
                      NO. {student.studentNo || '001'} · {currentTheme.name}
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide whitespace-nowrap">
                      {student.studentName ? `${student.studentName}의 포트폴리오` : '나만의 디저트 포트폴리오'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Change Cover Buttons */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-300">
              <button
                type="button"
                onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                className="hover:text-amber-200 flex items-center gap-1 underline underline-offset-2 whitespace-nowrap"
              >
                <Palette className="w-3 h-3" />
                <span>표지 스타일 ({currentTheme.name})</span>
              </button>

              <label className="hover:text-amber-200 flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <Upload className="w-3 h-3" />
                <span>나만의 사진 올리기</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomCoverUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Bottom Footer on Spine */}
          <div className="relative z-10 pt-4 border-t border-white/20 text-xs text-stone-300 flex items-center justify-between">
            <span className="whitespace-nowrap">20단원 플립북 실습일지</span>
            <span className="text-amber-300 font-medium whitespace-nowrap">
              {completedCount} / 20단원 누적
            </span>
          </div>
          {spreadSide === 'left' && (
            <button type="button" onClick={onOpenBook} className="relative z-10 mt-5 w-full py-3 rounded-xl border border-amber-200/50 bg-white/10 hover:bg-white/20 text-amber-100 font-bold flex items-center justify-center gap-2 transition-colors">
              <BookOpen className="w-4 h-4" /> 책 펼치기 <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        )}

        {/* Book Right Side: Editorial Cover Title & Student Info */}
        {showInfoPage && (
        <div className={`${spreadSide === 'full' ? 'md:w-7/12' : 'w-full'} p-8 sm:p-12 flex flex-col justify-between bg-stone-50/50 relative`}>
          <div>
            {/* Top Eyebrow & Quick Student Actions */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-semibold tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full uppercase whitespace-nowrap">
                부산관광고 MICE외식조리과 · 전체 20단원 과정 전자책
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={onNewStudent}
                  className="text-xs text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 transition-colors whitespace-nowrap"
                  title="새로운 학생으로 시작"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>새 학생</span>
                </button>
                <button
                  onClick={() => setIsDetailEditing(!isDetailEditing)}
                  className="text-xs text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 transition-colors whitespace-nowrap"
                  title="다짐 및 상세 수정"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isDetailEditing ? '간편 모드' : '상세 설정'}</span>
                </button>
              </div>
            </div>

            {/* Theme Picker Drawer if toggled */}
            {isThemePickerOpen && (
              <div className="p-3.5 mb-4 rounded-xl bg-stone-100 border border-stone-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1 whitespace-nowrap">
                    <Palette className="w-3.5 h-3.5 text-amber-600" />
                    <span>100인 100색 표지 스타일 선택 (클릭 시 즉시 적용)</span>
                  </span>
                  <button
                    onClick={() => setIsThemePickerOpen(false)}
                    className="text-[11px] text-stone-500 hover:text-stone-800"
                  >
                    닫기
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {COVER_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        onUpdateStudent({ coverThemeId: theme.id, customCoverImage: undefined });
                      }}
                      className={`p-1.5 rounded-lg text-left text-[11px] border transition-all flex items-center gap-1.5 ${
                        currentTheme.id === theme.id
                          ? 'border-amber-600 bg-white font-bold text-stone-900 shadow-2xs'
                          : 'border-stone-200 bg-white/70 hover:bg-white text-stone-600'
                      }`}
                    >
                      <span>{theme.emblemIcon}</span>
                      <span className="truncate">{theme.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Title: B-디저트 실무 (가독성 높은 한 줄 배치) */}
            <h1 className="font-serif-kr text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight mb-2 whitespace-nowrap">
              B-디저트 실무
            </h1>
            <p className="font-serif-kr text-sm sm:text-base text-stone-700 leading-normal mb-5 whitespace-nowrap overflow-hidden text-ellipsis">
              로컬 스토리와 전문 파티시에 테크닉을 담은 20단원 플립북 실습 포트폴리오
            </p>

            {/* Student Motto or Commitment: 학생이 직접 입력 / 예시는 placeholder로 보이고 작성 시 사라짐 */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>나의 파티시에 다짐</span>
                </p>
                <div className="flex items-center gap-2 text-[11px]">
                  {student.portfolioMotto ? (
                    <button
                      type="button"
                      onClick={handleClearMotto}
                      className="text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-0.5 whitespace-nowrap"
                      title="입력한 다짐을 지우고 다시 작성"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>다시 쓰기 (지우기)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyMottoExample}
                      className="text-amber-700 hover:text-amber-900 hover:underline whitespace-nowrap font-medium"
                      title="예시 문구를 그대로 불러오기"
                    >
                      💡 예시 적용하기
                    </button>
                  )}
                </div>
              </div>

              {/* 직접 작성하는 인풋: 학생이 글을 적으면 예시(placeholder)는 즉시 사라짐 */}
              <input
                type="text"
                value={student.portfolioMotto || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateStudent({ portfolioMotto: val });
                  setFormData((prev) => ({ ...prev, portfolioMotto: val }));
                }}
                placeholder={`예시) ${MOTTO_EXAMPLE}`}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-medium placeholder:text-stone-400 placeholder:font-normal focus:outline-none focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-500 transition-colors"
              />

              <div className="flex items-center justify-between mt-1.5 text-[11px]">
                <span className={student.portfolioMotto ? 'text-teal-700 font-medium' : 'text-stone-400'}>
                  {student.portfolioMotto
                    ? '✅ 나만의 파티시에 다짐이 저장되었습니다.'
                    : '※ 예시 문구를 참고하여 직접 입력하세요. 글을 입력하면 예시는 사라집니다.'}
                </span>
                <span className="text-stone-400 font-mono">
                  {(student.portfolioMotto || '').length}자
                </span>
              </div>
            </div>

            {/* Student Credentials Block: Direct Editable Form on Cover */}
            <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-300 space-y-3 mb-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5 whitespace-nowrap">
                  <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>표지 인적사항 (학생 및 지도교사 직접 입력)</span>
                </p>
                {/* 🌟 '고정'이란 단어 삭제 */}
                <span className="text-[11px] text-teal-700 font-semibold whitespace-nowrap">
                  부산관광고등학교
                </span>
              </div>

              {/* Grid with Direct Inputs for Student and Teacher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. School (소속 학교 및 학과 - 고정 단어 삭제) */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1 whitespace-nowrap">
                    소속 학교 및 학과
                  </label>
                  <div className="w-full px-3 py-2 bg-stone-200/80 border border-stone-300 rounded-lg text-stone-900 font-bold select-none cursor-not-allowed whitespace-nowrap text-xs truncate">
                    부산관광고등학교 MICE외식조리과
                  </div>
                </div>

                {/* 2. Practicum Units: '전체 20단원 과정'으로 정확히 표기 */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1 whitespace-nowrap">
                    실습 단원
                  </label>
                  <div className="w-full px-3 py-2 bg-stone-200/80 border border-stone-300 rounded-lg text-stone-900 font-bold select-none cursor-not-allowed whitespace-nowrap text-xs">
                    전체 20단원 과정
                  </div>
                </div>

                {/* 3. Student Number & Name (Directly written by student) */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-stone-700 whitespace-nowrap">
                    작성자 학번 / 성명 <span className="text-rose-500">*직접 입력</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={student.studentNo}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateStudent({ studentNo: val });
                        setFormData((prev) => ({ ...prev, studentNo: val }));
                      }}
                      placeholder="학번 (예: 30101)"
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      value={student.studentName}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateStudent({ studentName: val });
                        setFormData((prev) => ({ ...prev, studentName: val }));
                      }}
                      placeholder="성명 (예: 김파티)"
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* 4. Teacher Name (Directly written by student) */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-stone-700 whitespace-nowrap">
                    지도교사 성명 <span className="text-amber-700">*직접 입력</span>
                  </label>
                  <input
                    type="text"
                    value={student.teacherName}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateStudent({ teacherName: val });
                      setFormData((prev) => ({ ...prev, teacherName: val }));
                    }}
                    placeholder="지도교사 성명 직접 입력"
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {isDetailEditing && (
                <div className="pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={handleSaveDetail}
                    className="w-full py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Check className="w-3.5 h-3.5" /> 상세 설정 저장하기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Book Action CTA Buttons (한 줄 배치 및 직관적인 라벨) */}
          <div className="pt-5 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenBook}
              className="flex-1 py-3 px-6 bg-stone-900 text-white font-medium text-sm rounded-xl hover:bg-stone-800 transition-colors shadow-md flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>책 펼치기 (01단원 시작)</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
            <button
              onClick={onViewToc}
              className="py-3 px-5 bg-white text-stone-800 border border-stone-300 font-medium text-sm rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>목차 보기</span>
            </button>
            <button
              onClick={onOpenGoogleSheets}
              className="py-3 px-4 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-sm rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              title="구글 시트 연동 설정"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>구글 시트</span>
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
