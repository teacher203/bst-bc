import React from 'react';
import { StudentProfile } from '../types/portfolio';

export const BackCover: React.FC<{ student: StudentProfile; completedCount: number }> = ({ student, completedCount }) => (
  <div className="min-h-[calc(100vh-3.75rem)] bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-stone-100 p-10 sm:p-14 flex flex-col justify-between relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />
    <div className="relative border-b border-amber-200/25 pb-5 text-xs tracking-[0.18em] text-amber-200">B-DESSERT PRACTICE PORTFOLIO</div>
    <div className="relative text-center space-y-6">
      <div className="text-5xl">🍰</div>
      <h2 className="font-serif-kr text-3xl sm:text-4xl font-black">나만의 디저트 책을 완성하다</h2>
      <p className="text-stone-300 leading-7">배움과 실패, 개선과 성장을 한 장씩 기록한<br />{student.studentName || '나'}의 B-디저트 실무 포트폴리오</p>
      <div className="inline-flex rounded-full border border-amber-300/40 bg-white/5 px-5 py-2 text-sm text-amber-100">완료 기록 {completedCount} / 20단원</div>
    </div>
    <div className="relative border-t border-amber-200/25 pt-5 text-center">
      <p className="font-bold">부산관광고등학교 MICE외식조리과</p>
      <p className="mt-2 text-xs text-stone-400">끝이 아니라, 파티시에로 향하는 다음 장의 시작</p>
    </div>
  </div>
);
