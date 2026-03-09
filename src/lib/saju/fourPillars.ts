import { BirthInput, FourPillars, Pillar } from '@/types/saju';
import { STEM_ELEMENTS, STEM_YINYANG } from '@/lib/constants/stems';
import { BRANCH_ELEMENTS, BRANCH_YINYANG } from '@/lib/constants/branches';
import { TEN_GOD_TABLE, getGrowthStage } from '@/lib/constants/lookupTables';
import { calculateSaju as manseryeokSaju, getPillarByHangul } from '@fullstackfamily/manseryeok';

// ==========================================
// manseryeok 라이브러리 기반 사주팔자 계산
// KASI 데이터 기반, 1900~2050년 지원
// ==========================================

// 한글 주(柱) → stem/branch 인덱스 변환
function parsePillar(pillarHangul: string | null): [number, number] {
  if (!pillarHangul) return [0, 0];
  const p = getPillarByHangul(pillarHangul);
  if (!p) throw new Error(`Unknown pillar: ${pillarHangul}`);
  return [p.tiangan.id, p.dizhi.id];
}

// Pillar 객체 생성
function createPillar(stem: number, branch: number, dayMasterStem?: number): Pillar {
  const pillar: Pillar = {
    stem,
    branch,
    stemElement: STEM_ELEMENTS[stem],
    branchElement: BRANCH_ELEMENTS[branch],
    stemYinYang: STEM_YINYANG[stem],
    branchYinYang: BRANCH_YINYANG[branch],
  };

  if (dayMasterStem !== undefined) {
    pillar.tenGod = TEN_GOD_TABLE[dayMasterStem][stem];
    pillar.growthStage = getGrowthStage(dayMasterStem, branch);
  }

  return pillar;
}

// ==========================================
// 사주팔자 계산 메인 함수
// ==========================================
export function calculateFourPillars(input: BirthInput): FourPillars {
  const { year, month, day, hour, minute = 0 } = input;

  // manseryeok 라이브러리로 사주 계산
  const result = manseryeokSaju(year, month, day, hour, minute);

  // 야자시(23:00~23:59) 처리: 다음날 일주 사용
  // manseryeok은 전통 방식(당일 일주)이므로, 다음날로 재계산
  let dayPillarStr = result.dayPillar;
  let hourPillarStr = result.hourPillar;

  if (hour >= 23) {
    const nextDay = new Date(year, month - 1, day + 1);
    const nextResult = manseryeokSaju(
      nextDay.getFullYear(),
      nextDay.getMonth() + 1,
      nextDay.getDate(),
      0, 0
    );
    dayPillarStr = nextResult.dayPillar;
    hourPillarStr = nextResult.hourPillar; // 다음날 자시 = 임자/갑자 등
  }

  // 한글 주(柱) → 숫자 인덱스 변환
  const [yearStem, yearBranch] = parsePillar(result.yearPillar);
  const [monthStem, monthBranch] = parsePillar(result.monthPillar);
  const [dayStem, dayBranch] = parsePillar(dayPillarStr);
  const [hourStem, hourBranch] = parsePillar(hourPillarStr);

  const dayMaster = dayStem;

  return {
    year: createPillar(yearStem, yearBranch, dayMaster),
    month: createPillar(monthStem, monthBranch, dayMaster),
    day: createPillar(dayStem, dayBranch, dayMaster),
    hour: createPillar(hourStem, hourBranch, dayMaster),
  };
}
