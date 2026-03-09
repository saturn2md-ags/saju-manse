'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { analyzeSaju } from '@/lib/saju';
import { BirthInput, Gender } from '@/types/saju';
import { STEMS, STEMS_HANJA } from '@/lib/constants/stems';
import { BRANCHES, BRANCHES_HANJA, BRANCH_ANIMALS } from '@/lib/constants/branches';
import FourPillarsCard from '@/components/saju/FourPillarsCard';
import CoreSummaryCard from '@/components/saju/CoreSummaryCard';
import TenGodsSection from '@/components/saju/TenGodsSection';
import ElementBalanceComponent from '@/components/saju/ElementBalance';
import DaeunTimeline from '@/components/saju/DaeunTimeline';
import AnnualLuckList from '@/components/saju/AnnualLuckList';
import MonthlyLuckList from '@/components/saju/MonthlyLuckList';

import SpecialStarsSection from '@/components/saju/SpecialStarsSection';
import InteractionsSection from '@/components/saju/InteractionsSection';
import GongMangSection from '@/components/saju/GongMangSection';

import Link from 'next/link';

function ResultContent() {
  const searchParams = useSearchParams();

  const input: BirthInput = useMemo(() => {
    const clamp = (val: number, min: number, max: number, fallback: number) =>
      isNaN(val) ? fallback : Math.max(min, Math.min(max, val));

    const rawGender = searchParams.get('gender');
    const gender: Gender = rawGender === '여' ? '여' : '남';

    return {
      year: clamp(parseInt(searchParams.get('year') || ''), 1900, 2100, 2000),
      month: clamp(parseInt(searchParams.get('month') || ''), 1, 12, 1),
      day: clamp(parseInt(searchParams.get('day') || ''), 1, 31, 1),
      hour: clamp(parseInt(searchParams.get('hour') || ''), 0, 23, 12),
      minute: clamp(parseInt(searchParams.get('minute') || ''), 0, 59, 0),
      gender,
      isLunar: searchParams.get('lunar') === '1',
      isLeapMonth: searchParams.get('leapMonth') === '1',
    };
  }, [searchParams]);

  const result = useMemo(() => analyzeSaju(input), [input]);

  const yearAnimal = BRANCH_ANIMALS[result.fourPillars.year.branch];

  return (
    <div className="min-h-screen bg-[#0D0D14] text-white pb-12">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-[#0D0D14]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            ← 다시 입력
          </Link>
          <h1 className="text-sm font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            만세력 풀이
          </h1>
          <div className="w-16" />
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm">
            {input.isLunar ? (input.isLeapMonth ? '음력(윤달)' : '음력') : '양력'} {input.year}년 {input.month}월 {input.day}일 {input.hour}시 {input.minute}분
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {input.gender === '남' ? '남성' : '여성'} · {yearAnimal}띠 ·
            {' '}{STEMS_HANJA[result.fourPillars.year.stem]}{BRANCHES_HANJA[result.fourPillars.year.branch]}년
            {' '}{STEMS_HANJA[result.fourPillars.month.stem]}{BRANCHES_HANJA[result.fourPillars.month.branch]}월
            {' '}{STEMS_HANJA[result.fourPillars.day.stem]}{BRANCHES_HANJA[result.fourPillars.day.branch]}일
            {' '}{STEMS_HANJA[result.fourPillars.hour.stem]}{BRANCHES_HANJA[result.fourPillars.hour.branch]}시
          </p>
        </div>

        {/* 각 섹션들 */}
        <div className="space-y-6">
          {/* 1. 사주팔자 */}
          <FourPillarsCard pillars={result.fourPillars} />

          {/* 2. 나의 사주 핵심 (격국 + 일간 + 십신 종합) */}
          <CoreSummaryCard pillars={result.fourPillars} />

          {/* 3. 십성 분석 */}
          <TenGodsSection pillars={result.fourPillars} />

          {/* 4. 오행 밸런스 */}
          <ElementBalanceComponent balance={result.elementBalance} />

          {/* 5. 합충형파해 */}
          <InteractionsSection interactions={result.interactions} />

          {/* 6. 신살 */}
          <SpecialStarsSection stars={result.specialStars} />

          {/* 7. 공망 */}
          <GongMangSection gongMang={result.gongMang} />

          {/* 8. 대운 */}
          <DaeunTimeline
            cycles={result.daeun}
            startAge={result.daeunStartAge}
            direction={result.daeunDirection}
            birthYear={input.year}
          />

          {/* 9. 세운 */}
          <AnnualLuckList annualLuck={result.annualLuck} />

          {/* 10. 월운 */}
          <MonthlyLuckList
            monthlyLuck={result.monthlyLuck}
            year={new Date().getFullYear()}
          />
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 bg-gray-900/50 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            이 분석은 전통 사주명리학을 기반으로 한 참고 자료이며,
            실제 인생의 모든 것을 결정하지 않아요.
            자기 자신을 이해하는 재미있는 도구로 활용해보세요!
          </p>
        </div>

        {/* 다시 분석 버튼 */}
        <Link
          href="/"
          className="block w-full mt-6 py-4 rounded-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all"
        >
          다른 사주 분석하기
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D14] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔮</div>
          <p className="text-gray-400 text-sm">사주를 분석하고 있어요...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
