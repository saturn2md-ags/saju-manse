// 오행 (Five Elements)
export type Element = '목' | '화' | '토' | '금' | '수';

// 음양 (Yin-Yang)
export type YinYang = '양' | '음';

// 십성 (Ten Gods)
export type TenGod = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';

// 12운성 (Twelve Growth Stages)
export type GrowthStage = '장생' | '목욕' | '관대' | '건록' | '제왕' | '쇠' | '병' | '사' | '묘' | '절' | '태' | '양';

// 기둥 하나
export interface Pillar {
  stem: number;          // 천간 index (0-9)
  branch: number;        // 지지 index (0-11)
  stemElement: Element;
  branchElement: Element;
  stemYinYang: YinYang;
  branchYinYang: YinYang;
  tenGod?: TenGod;       // 일간 기준 십성
  growthStage?: GrowthStage; // 일간 기준 12운성
  branchTenGod?: TenGod; // 지지 본기 기준 십성
}

// 사주팔자 (Four Pillars)
export interface FourPillars {
  year: Pillar;    // 년주
  month: Pillar;   // 월주
  day: Pillar;     // 일주 (일간 = day master)
  hour?: Pillar;   // 시주 (시간 미입력 시 없음)
}

// 대운 (Major Luck Cycle)
export interface DaeunCycle {
  startAge: number;
  stem: number;
  branch: number;
  tenGod: TenGod;
  branchTenGod: TenGod;
  growthStage: GrowthStage;
  specialStars: string[];
}

// 세운 (Annual Luck)
export interface AnnualLuck {
  year: number;
  stem: number;
  branch: number;
  tenGod: TenGod;
  branchTenGod: TenGod;
  growthStage: GrowthStage;
  specialStars: string[];
}

// 월운 (Monthly Luck)
export interface MonthlyLuck {
  month: number;
  stem: number;
  branch: number;
  tenGod: TenGod;
  branchTenGod: TenGod;
  growthStage: GrowthStage;
  specialStars: string[];
}

// 합충 (Interactions)
export interface Interaction {
  type: '천간합' | '천간충' | '지지삼합' | '지지방합' | '지지육합' | '지지충' | '지지형' | '지지파' | '지지해';
  positions: string[];  // e.g. ['년지', '월지']
  description: string;
}

// 신살 (Special Stars)
export interface SpecialStar {
  name: string;
  position: string;  // e.g. '년지', '일지'
  isPositive: boolean;
}

// 오행 밸런스
export interface ElementBalance {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

// 공망 (Void)
export interface GongMang {
  yearGongMang: [number, number]; // 2 branches
  dayGongMang: [number, number];
}

// 지지 장간 (Hidden Stems in Branches)
export interface HiddenStem {
  main: number;    // 본기
  middle?: number; // 중기
  residual?: number; // 여기
}

// 성별
export type Gender = '남' | '여';

// 입력 정보
export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  gender: Gender;
  isLunar?: boolean;
  isLeapMonth?: boolean; // 음력 윤달 여부
}

// 전체 분석 결과
export interface SajuResult {
  input: BirthInput;
  fourPillars: FourPillars;
  elementBalance: ElementBalance;
  daeun: DaeunCycle[];
  daeunStartAge: number;
  daeunDirection: '순행' | '역행';
  annualLuck: AnnualLuck[];
  monthlyLuck: MonthlyLuck[];
  interactions: Interaction[];
  specialStars: SpecialStar[];
  gongMang: GongMang;
}
