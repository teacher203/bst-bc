import React, { useState } from 'react';
import { Calculator, Sparkles, Flame, Eye, Copy, Check, Star } from 'lucide-react';

interface InteractiveUnitWidgetProps {
  unitId: number;
  onApplyData?: (key: string, val: string) => void;
}

export const InteractiveUnitWidget: React.FC<InteractiveUnitWidgetProps> = ({
  unitId,
  onApplyData,
}) => {
  // Unit 5: Specific Gravity Calculator
  const [cupWater, setCupWater] = useState<number>(100);
  const [cupBatter, setCupBatter] = useState<number>(48);

  // Unit 11: Tempering Interactive Gauge
  const [temperStage, setTemperStage] = useState<1 | 2 | 3>(1);

  // Unit 15: Cost & Target Price Calculator
  const [materialCost, setMaterialCost] = useState<number>(24000);
  const [packageCost, setPackageCost] = useState<number>(4000);
  const [yieldCount, setYieldCount] = useState<number>(20);
  const [targetMarginRatio, setTargetMarginRatio] = useState<number>(30); // 30%

  // Unit 18: Instagram Feed Simulator
  const [postHeadline, setPostHeadline] = useState<string>('부산의 파도를 구워낸 바다결 쿠키 🌊');
  const [copiedTags, setCopiedTags] = useState(false);

  // Unit 20: Sensory Star Ratings
  const [ratings, setRatings] = useState({
    visual: 5,
    aroma: 4,
    texture: 5,
    taste: 4,
    originality: 5,
  });

  // Render widget according to unit
  if (unitId === 5) {
    const calculatedGravity = cupWater > 0 ? (cupBatter / cupWater).toFixed(2) : '0.00';
    const numGravity = Number(calculatedGravity);
    let gravityStatus = '적정 (이상적인 부드러운 스펀지 케이크)';
    let statusColor = 'text-teal-700 bg-teal-50 border-teal-200';
    if (numGravity < 0.42) {
      gravityStatus = '과소 (기포 과다/오븐에서 꺼짐 위험)';
      statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
    } else if (numGravity > 0.52) {
      gravityStatus = '과다 (기포 손실/떡진 조직감 우려)';
      statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
    }

    return (
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-amber-700" />
            <span>🌊 05단원 전용 도구: 제누아즈 비중(Specific Gravity) 자동 계산기</span>
          </span>
          <span className="text-[10px] text-amber-800 font-semibold bg-amber-200/80 px-2 py-0.5 rounded-full">
            공식: 반죽무게 ÷ 물무게
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-stone-600 mb-1">측정 컵의 물 순수무게(g)</label>
            <input
              type="number"
              value={cupWater}
              onChange={(e) => setCupWater(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-stone-900"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1">같은 컵의 제누아즈 반죽무게(g)</label>
            <input
              type="number"
              value={cupBatter}
              onChange={(e) => setCupBatter(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-stone-900"
            />
          </div>
        </div>

        <div className={`p-3 rounded-lg border flex items-center justify-between ${statusColor}`}>
          <div>
            <span className="text-[11px] block">산출된 비중 값</span>
            <span className="text-xl font-black">{calculatedGravity}</span>
          </div>
          <div className="text-right">
            <span className="font-bold block">{gravityStatus}</span>
            <span className="text-[10px] opacity-80">제누아즈 표준 권장 비중: 0.45 ~ 0.50</span>
          </div>
        </div>

        {onApplyData && (
          <button
            type="button"
            onClick={() => onApplyData('specificGravity', calculatedGravity)}
            className="w-full py-1.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            산출된 비중({calculatedGravity})을 실습기록에 바로 적용하기
          </button>
        )}
      </div>
    );
  }

  if (unitId === 11) {
    return (
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-700" />
            <span>🍫 11단원 전용 도구: 다크 초콜릿 템퍼링 3단계 온도 시뮬레이터</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <button
            type="button"
            onClick={() => setTemperStage(1)}
            className={`p-2.5 rounded-lg border transition-all ${
              temperStage === 1
                ? 'bg-rose-600 text-white border-rose-700 shadow-xs font-bold'
                : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            <span className="text-[10px] block opacity-80">1단계 완전용해</span>
            <span className="text-sm font-black">45 ~ 50℃</span>
          </button>
          <button
            type="button"
            onClick={() => setTemperStage(2)}
            className={`p-2.5 rounded-lg border transition-all ${
              temperStage === 2
                ? 'bg-sky-600 text-white border-sky-700 shadow-xs font-bold'
                : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            <span className="text-[10px] block opacity-80">2단계 결정핵성</span>
            <span className="text-sm font-black">27 ~ 28℃</span>
          </button>
          <button
            type="button"
            onClick={() => setTemperStage(3)}
            className={`p-2.5 rounded-lg border transition-all ${
              temperStage === 3
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs font-bold'
                : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            <span className="text-[10px] block opacity-80">3단계 베타결정</span>
            <span className="text-sm font-black">31 ~ 32℃</span>
          </button>
        </div>

        <div className="p-3 bg-white rounded-lg border border-stone-200 text-stone-700 leading-relaxed">
          {temperStage === 1 && (
            <p>🔥 <b>1단계(45~50℃)</b>: 모든 카카오버터 결정을 완전히 녹여 초기화합니다. 절대 55℃를 넘지 않게 타지 않도록 주의하세요.</p>
          )}
          {temperStage === 2 && (
            <p>❄️ <b>2단계(27~28℃)</b>: 얼음물 받침 또는 대리석 테이블 위에서 저어가며 불안정 결정과 안정 결정의 씨앗을 만듭니다.</p>
          )}
          {temperStage === 3 && (
            <p>✨ <b>3단계(31~32℃)</b>: 1~2초간 살짝 중탕하여 불안정 결정을 녹이고 반짝이는 광택을 지닌 <b>안정 베타(V) 결정</b>만 남깁니다!</p>
          )}
        </div>
      </div>
    );
  }

  if (unitId === 15) {
    const totalProductionCost = materialCost + packageCost;
    const unitCost = yieldCount > 0 ? Math.round(totalProductionCost / yieldCount) : 0;
    const targetPrice = targetMarginRatio > 0 ? Math.round(unitCost / (targetMarginRatio / 100)) : 0;

    return (
      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-teal-700" />
            <span>🧾 15단원 전용 도구: 실시간 원가율 &amp; 권장 판매가 계산기</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="block text-stone-600 mb-1">총 재료비(원)</label>
            <input
              type="number"
              value={materialCost}
              onChange={(e) => setMaterialCost(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-stone-900"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1">총 포장재비(원)</label>
            <input
              type="number"
              value={packageCost}
              onChange={(e) => setPackageCost(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-stone-900"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1">생산 정품수(개)</label>
            <input
              type="number"
              value={yieldCount}
              onChange={(e) => setYieldCount(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-stone-900"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1">목표 원가율(%)</label>
            <input
              type="number"
              value={targetMarginRatio}
              onChange={(e) => setTargetMarginRatio(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-stone-900"
            />
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-teal-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 block">개당 원가</span>
            <span className="text-base font-bold text-stone-900">{unitCost.toLocaleString()}원</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-teal-700 block font-semibold">목표 원가율({targetMarginRatio}%) 기준 권장 판매가</span>
            <span className="text-xl font-black text-teal-800">{targetPrice.toLocaleString()}원</span>
          </div>
        </div>

        {onApplyData && (
          <button
            type="button"
            onClick={() => {
              onApplyData('materialCost', String(materialCost));
              onApplyData('packageCost', String(packageCost));
              onApplyData('yield', String(yieldCount));
              onApplyData('unitCost', String(unitCost));
              onApplyData('price', `권장 판매가: ${targetPrice.toLocaleString()}원 (목표원가율 ${targetMarginRatio}%)`);
            }}
            className="w-full py-1.5 bg-teal-800 text-white rounded text-xs font-semibold hover:bg-teal-900 transition-colors"
          >
            계산된 원가 및 판매가를 실습일지에 한 번에 입력하기
          </button>
        )}
      </div>
    );
  }

  if (unitId === 18) {
    const hashtagText = '#부산관광고 #MICE외식조리과 #부산디저트 #디저트실무 #베이킹포트폴리오 #파티시에';

    const handleCopyTags = () => {
      navigator.clipboard.writeText(hashtagText);
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    };

    return (
      <div className="p-4 rounded-xl bg-pink-50/70 border border-pink-200 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-pink-600" />
            <span>📱 18단원 전용 도구: SNS 피드 라이브 시뮬레이터 &amp; 해시태그 생성기</span>
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={postHeadline}
            onChange={(e) => setPostHeadline(e.target.value)}
            placeholder="첫 문장 헤드라인을 입력해 보세요"
            className="flex-1 px-3 py-1.5 bg-white border border-pink-200 rounded text-stone-900"
          />
        </div>

        <div className="p-3 bg-white rounded-lg border border-pink-200 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 text-white text-[10px] flex items-center justify-center font-bold">
              B
            </div>
            <span className="font-bold text-stone-800 text-[11px]">busan_pastry_studio</span>
          </div>
          <p className="text-stone-900 font-medium">{postHeadline}</p>
          <p className="text-[11px] text-sky-700 leading-relaxed font-mono">{hashtagText}</p>
        </div>

        <button
          type="button"
          onClick={handleCopyTags}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 text-white rounded-lg text-xs font-semibold hover:bg-pink-700 transition-colors"
        >
          {copiedTags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedTags ? '해시태그 복사됨!' : '인스타그램 해시태그 세트 복사'}</span>
        </button>
      </div>
    );
  }

  if (unitId === 20) {
    const handleStar = (key: keyof typeof ratings, val: number) => {
      setRatings({ ...ratings, [key]: val });
    };

    return (
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>🏆 20단원 전용 도구: 5대 항목 관능평가(Sensory Evaluation) 별점 판정기</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(
            [
              ['visual', '1. 시각적 외관 (Visual)'],
              ['aroma', '2. 고유 향기 (Aroma)'],
              ['texture', '3. 식감과 조직감 (Texture)'],
              ['taste', '4. 단맛과 조화 (Taste)'],
              ['originality', '5. 부산 로컬 독창성 (Originality)'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="p-2 bg-white rounded border border-stone-200 flex items-center justify-between">
              <span className="font-medium text-stone-800">{label}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStar(key, star)}
                    className="p-0.5 text-amber-500 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        ratings[key] >= star ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {onApplyData && (
          <button
            type="button"
            onClick={() => {
              const sensoryText = `외관(${ratings.visual}점), 향기(${ratings.aroma}점), 식감(${ratings.texture}점), 맛(${ratings.taste}점), 독창성(${ratings.originality}점) - 5대 관능평가 완료`;
              onApplyData('sensory', sensoryText);
            }}
            className="w-full py-1.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            별점 평가 결과를 실습일지에 적용하기
          </button>
        )}
      </div>
    );
  }

  // Fallback for general units
  return null;
};
