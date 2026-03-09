import { BirthInput, SajuResult } from '@/types/saju';
import { calculateFourPillars } from './fourPillars';
import { calculateElementBalance } from './elements';
import { getDaeunDirection, calculateDaeunStartAge, calculateDaeun, calculateAnnualLuck, calculateMonthlyLuck } from './daeun';
import { analyzeInteractions } from './interactions';
import { analyzeSpecialStars } from './specialStars';
import { getGongMang } from '@/lib/constants/lookupTables';
import { lunarToSolar } from '@fullstackfamily/manseryeok';

// ==========================================
// 음력 → 양력 변환 (manseryeok KASI 데이터 기반)
// ==========================================
function convertLunarToSolar(input: BirthInput): BirthInput {
  if (!input.isLunar) return input;

  const result = lunarToSolar(input.year, input.month, input.day, input.isLeapMonth || false);

  return {
    ...input,
    year: result.solar.year,
    month: result.solar.month,
    day: result.solar.day,
    isLunar: false,
  };
}

// ==========================================
// 전체 사주 분석 메인 함수
// ==========================================
export function analyzeSaju(input: BirthInput): SajuResult {
  // 0. 음력이면 양력으로 변환
  const solarInput = convertLunarToSolar(input);

  // 1. 사주팔자 계산
  const fourPillars = calculateFourPillars(solarInput);
  const dayMaster = fourPillars.day.stem;

  // 2. 오행 밸런스
  const elementBalance = calculateElementBalance(fourPillars);

  // 3. 대운 계산
  const daeunDirection = getDaeunDirection(fourPillars.year.stem, solarInput.gender);
  const daeunStartAge = calculateDaeunStartAge(solarInput, daeunDirection);
  const daeun = calculateDaeun(fourPillars, solarInput, daeunDirection, daeunStartAge);

  // 4. 세운 (현재 년도 전후 10년)
  const currentYear = new Date().getFullYear();
  const yearBranch = fourPillars.year.branch;
  const dayBranch = fourPillars.day.branch;
  const annualLuck = calculateAnnualLuck(dayMaster, currentYear - 3, 10, yearBranch, dayBranch);

  // 5. 월운 (현재 년도)
  const monthlyLuck = calculateMonthlyLuck(dayMaster, currentYear, yearBranch, dayBranch);

  // 6. 합충형파해
  const interactions = analyzeInteractions(fourPillars);

  // 7. 신살
  const specialStars = analyzeSpecialStars(fourPillars);

  // 8. 공망
  const yearGongMang = getGongMang(fourPillars.year.stem, fourPillars.year.branch);
  const dayGongMang = getGongMang(fourPillars.day.stem, fourPillars.day.branch);

  return {
    input,
    fourPillars,
    elementBalance,
    daeun,
    daeunStartAge,
    daeunDirection,
    annualLuck,
    monthlyLuck,
    interactions,
    specialStars,
    gongMang: {
      yearGongMang,
      dayGongMang,
    },
  };
}

export { calculateFourPillars } from './fourPillars';
export { analyzeTenGods } from './tenGods';
export { calculateElementBalance, getElementPercentages, estimateYongsin } from './elements';
export { getDaeunDirection, calculateDaeunStartAge, calculateDaeun, calculateAnnualLuck, calculateMonthlyLuck } from './daeun';
export { analyzeInteractions } from './interactions';
export { analyzeSpecialStars } from './specialStars';
