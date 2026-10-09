import { UnitDefinition, CoachFeedback } from '../types/portfolio';

export interface CoachEvaluationResult {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  score: number;
  metrics: {
    process: number;
    cause: number;
    reflection: number;
  };
  feedback: CoachFeedback;
  gradeMessage: string;
}

export function evaluateStudentLog(
  unit: UnitDefinition,
  dynamicData: Record<string, string>,
  satisfaction: number,
  strength: string,
  reflection: string,
  improvement: string,
  procedureNotes?: string
): CoachEvaluationResult {
  const fields = unit.fields;
  const filledFields = fields.filter((f) => (dynamicData[f.key] || '').trim().length > 0);
  const procedureLength = (procedureNotes || '').trim().length;
  
  // 1. Process recording score (50%) - incorporates student procedure notes (especially for units 1~13)
  const baseProcessScore = (filledFields.length / Math.max(1, fields.length)) * 100;
  // If student wrote their own procedure notes, bonus points up to 100
  const procedureScore = Math.min(100, procedureLength > 15 ? 100 : (procedureLength / 15) * 80);
  const processScore = Math.round(baseProcessScore * 0.7 + procedureScore * 0.3);

  // 2. Cause deduction score (25%)
  const causeScore = Math.min(100, (reflection.trim().length * 3) + (improvement.trim().length * 2));

  // 3. Self-reflection score (25%)
  const reflectionScore = Math.min(
    100,
    (strength.trim().length * 2) +
    reflection.trim().length +
    improvement.trim().length +
    (satisfaction * 6)
  );

  // Overall total score
  const totalScore = Math.min(100, Math.round(processScore * 0.5 + causeScore * 0.25 + reflectionScore * 0.25));

  let grade: 'A' | 'B' | 'C' | 'D' | 'E' = 'E';
  if (totalScore >= 90) grade = 'A';
  else if (totalScore >= 80) grade = 'B';
  else if (totalScore >= 70) grade = 'C';
  else if (totalScore >= 60) grade = 'D';

  const gradeMessages: Record<string, string> = {
    A: '핵심 제조 공정과 실험 결과를 정밀하게 기록하고, 원인과 다음 행동을 훌륭하게 연결했습니다. 파티시에 수준의 완성도입니다.',
    B: '주요 제조 공정 기록과 성찰이 잘 연결되었습니다. 빠진 수치나 온도 조건을 한 가지만 더 보완하면 A등급에 도달합니다.',
    C: '기본 기록은 갖추었습니다. 단순히 느낌만 적기보다 실패나 성공의 화학적/물리적 원인을 구체적인 문장으로 연결해 보세요.',
    D: '일부 기록이 부족합니다. 배합비, 굽기 조건 등 빠진 공정 수치와 반성·보완 내용을 보강해 주세요.',
    E: '코칭에 필요한 기록이 많이 비어 있습니다. 단원별 제조 공정과 핵심 항목, 자기평가를 직접 꼼꼼히 작성해 보세요.',
  };

  // Positives extraction
  const positives: string[] = [];
  if (procedureLength >= 20) {
    positives.push('제조 공정 및 만드는 방법을 학생 본인의 언어로 상세히 직접 작성한 점');
  }
  if (filledFields.length >= Math.ceil(fields.length * 0.7)) {
    positives.push('단원별 핵심 공정 측정 기록을 70% 이상 충실히 남긴 점');
  }
  const hasNumbers = filledFields.some((f) =>
    /온도|시간|중량|수량|원가|규격|비중|g|℃|mm|분/.test(f.label + (dynamicData[f.key] || ''))
  );
  if (hasNumbers) {
    positives.push('판단에 필수적인 정량적 수치와 조건을 기록한 점');
  }
  if (strength.trim().length >= 10) {
    positives.push('스스로 잘한 테크닉을 구체적으로 포착한 점');
  }
  if (improvement.trim().length >= 10) {
    positives.push('다음 실습 행동을 미리 명확히 정한 점');
  }
  if (positives.length === 0) {
    positives.push('완제품을 스스로 돌아보고 개선점을 찾으려는 진지한 실습 태도');
  }

  // Observed evidence
  const observedDetails = filledFields.slice(0, 2).map((f) => `${f.label}: ${dynamicData[f.key]}`);
  if (observedDetails.length > 0) {
    positives.push(`기록 근거: ${observedDetails.join(' / ')}`);
  }

  // Causes extraction
  const causes: string[] = [];
  if (procedureLength < 10) {
    causes.push('제조 공정 및 만드는 방법이 아직 비어 있어 공정 오류 분석이 어렵습니다. 실제 수행한 제조 순서를 직접 적어보세요.');
  }
  if (reflection.trim().length >= 8) {
    causes.push(`학생이 기록한 “${reflection.trim().slice(0, 50)}${reflection.trim().length > 50 ? '…' : ''}”은 단원별 온도·시간 변수와 밀접한 연관이 있습니다.`);
  } else {
    causes.push('반성 기록이 다소 짧아 원인을 단정하기 어렵습니다. 가장 아쉬웠던 식감이나 외관 결과를 구체적으로 적어 보세요.');
  }
  const missingLabels = fields.filter((f) => !dynamicData[f.key]?.trim()).slice(0, 2).map((f) => f.label);
  if (missingLabels.length > 0) {
    causes.push(`원인 규명을 위해 [${missingLabels.join(', ')}] 항목의 데이터를 보완할 것을 권장합니다.`);
  }

  // Fixes extraction
  const fixes: string[] = [];
  if (improvement.trim().length >= 8) {
    fixes.push(`학생이 계획한 “${improvement.trim().slice(0, 55)}${improvement.trim().length > 55 ? '…' : ''}”을 다음 실습의 1순위 행동 지침으로 실행하세요.`);
  } else {
    fixes.push('다음 실습에서 바꿀 변수 한 가지를 수치(온도, 시간, 중량)나 조리 동작으로 구체화해 보세요.');
  }
  const variableField = fields[1]?.label || fields[0]?.label;
  fixes.push(`${unit.title}에서는 “${variableField}”을(를) 통제 변수로 정하고 전·후 사진을 비교해 차이를 검증하세요.`);

  // Coach Question & Mission
  const compareA = fields[1]?.label || fields[0]?.label;
  const compareB = fields[fields.length - 1]?.label;
  const question = `“${compareA}”의 설정값이 최종 “${compareB}” 결과에 어떤 결정적 영향을 주었나요? 다음 번에는 무엇을 한 가지만 조정해 보겠습니까?`;
  const mission = improvement.trim() || `${compareA}의 실습 전·후 수치를 저울/온도계로 측정하고, ${compareB}의 개선 상태를 사진으로 비교 기록하기`;

  return {
    grade,
    score: totalScore,
    metrics: {
      process: processScore,
      cause: causeScore,
      reflection: reflectionScore,
    },
    feedback: {
      positives,
      causes,
      fixes,
      question,
      mission,
    },
    gradeMessage: gradeMessages[grade],
  };
}
