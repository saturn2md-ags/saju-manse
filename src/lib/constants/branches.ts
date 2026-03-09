import { Element, YinYang, HiddenStem } from '@/types/saju';

// 지지 (Earthly Branches) - 12개
export const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;
export const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

// 지지별 오행 (본기 기준)
export const BRANCH_ELEMENTS: Element[] = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];

// 지지별 음양
export const BRANCH_YINYANG: YinYang[] = ['양', '음', '양', '음', '양', '음', '양', '음', '양', '음', '양', '음'];

// 지지 장간 (Hidden Stems) - 본기, 중기, 여기
// index는 천간 index (0=갑, 1=을, ...)
export const BRANCH_HIDDEN_STEMS: HiddenStem[] = [
  { main: 9 },                    // 자: 계(수)
  { main: 5, middle: 9, residual: 7 }, // 축: 기(토), 계(수), 신(금)
  { main: 0, middle: 2, residual: 4 }, // 인: 갑(목), 병(화), 무(토)
  { main: 1 },                    // 묘: 을(목)
  { main: 4, middle: 1, residual: 9 }, // 진: 무(토), 을(목), 계(수)
  { main: 2, middle: 4, residual: 6 }, // 사: 병(화), 무(토), 경(금)
  { main: 3, middle: 5 },         // 오: 정(화), 기(토)
  { main: 5, middle: 3, residual: 1 }, // 미: 기(토), 정(화), 을(목)
  { main: 6, middle: 4, residual: 8 }, // 신: 경(금), 무(토), 임(수)
  { main: 7 },                    // 유: 신(금)
  { main: 4, middle: 7, residual: 3 }, // 술: 무(토), 신(금), 정(화)
  { main: 8, middle: 0 },         // 해: 임(수), 갑(목)
];

// 지지 띠 동물
export const BRANCH_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'] as const;

// 시간대 (시주 결정용) - 각 지지의 시작 시간
// 자시: 23:00-01:00, 축시: 01:00-03:00, ...
export const HOUR_BRANCHES: [number, number][] = [
  [23, 1],  // 자 (23:00 ~ 00:59)
  [1, 3],   // 축 (01:00 ~ 02:59)
  [3, 5],   // 인 (03:00 ~ 04:59)
  [5, 7],   // 묘 (05:00 ~ 06:59)
  [7, 9],   // 진 (07:00 ~ 08:59)
  [9, 11],  // 사 (09:00 ~ 10:59)
  [11, 13], // 오 (11:00 ~ 12:59)
  [13, 15], // 미 (13:00 ~ 14:59)
  [15, 17], // 신 (15:00 ~ 16:59)
  [17, 19], // 유 (17:00 ~ 18:59)
  [19, 21], // 술 (19:00 ~ 20:59)
  [21, 23], // 해 (21:00 ~ 22:59)
];
