// 절기 (Solar Terms) 데이터
// 만세력에서 월주를 결정하는 핵심 데이터
// 절기는 태양의 황경에 따라 결정되며, 매년 날짜가 조금씩 다름

// 절기 이름 (24절기 중 '절'만 사용 - 월의 시작을 결정)
export const SOLAR_TERM_NAMES = [
  '입춘', '경칩', '청명', '입하', '망종', '소서',
  '입추', '백로', '한로', '입동', '대설', '소한'
] as const;

// 절기에 대응하는 월의 지지 index
// 입춘(1월) -> 인(2), 경칩(2월) -> 묘(3), ..., 소한(12월) -> 축(1)
export const SOLAR_TERM_MONTH_BRANCH = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

// 절기 데이터: 각 년도별 절기 날짜/시간
// 형식: { month, day, hour, minute } (UTC+9 한국시간 기준)
// 1940~2050년까지 지원
// 태양 황경 알고리즘 (Jean Meeus "Astronomical Algorithms" 2nd ed.)으로 계산
// VSOP87 + IAU 1980 세차 + 광행차 보정

interface SolarTermDate {
  month: number;
  day: number;
  hour: number;
  minute: number;
}

// 절기별 태양 황경 (도)
const SOLAR_TERM_LONGITUDES = [315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285];

// 근사 절기 날짜 계산 (오차 ±1일 수준)
// 1940-2050 범위 밖의 연도에 대한 폴백
function approximateSolarTermDate(year: number, termIndex: number): SolarTermDate {
  const avgDates: [number, number][] = [
    [2, 4],   // 입춘: 2/4
    [3, 6],   // 경칩: 3/6
    [4, 5],   // 청명: 4/5
    [5, 6],   // 입하: 5/6
    [6, 6],   // 망종: 6/6
    [7, 7],   // 소서: 7/7
    [8, 7],   // 입추: 8/7
    [9, 8],   // 백로: 9/8
    [10, 8],  // 한로: 10/8
    [11, 7],  // 입동: 11/7
    [12, 7],  // 대설: 12/7
    [1, 6],   // 소한: 1/6
  ];

  const [month, avgDay] = avgDates[termIndex];
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  let dayCorrection = 0;

  if (year >= 2000) {
    dayCorrection = Math.floor((year - 2000) * 0.01);
  } else {
    dayCorrection = -Math.floor((2000 - year) * 0.01);
  }

  if (isLeap && month > 2) {
    dayCorrection -= 1;
  }

  const day = Math.max(1, Math.min(28, avgDay + dayCorrection));
  return { month, day, hour: 0, minute: 0 };
}

// 1940-2050년 정밀 절기 데이터
// Jean Meeus 천문 알고리즘으로 계산 (VSOP87 지구 공전 궤도 + IAU 1980 세차)
const preciseData: Record<number, SolarTermDate[]> = {
    1940: [
      { month: 2, day: 5, hour: 8, minute: 7 },   // 입춘
      { month: 3, day: 6, hour: 2, minute: 24 },   // 경칩
      { month: 4, day: 5, hour: 7, minute: 34 },   // 청명
      { month: 5, day: 6, hour: 1, minute: 16 },   // 입하
      { month: 6, day: 6, hour: 5, minute: 44 },   // 망종
      { month: 7, day: 7, hour: 16, minute: 8 },   // 소서
      { month: 8, day: 8, hour: 1, minute: 52 },   // 입추
      { month: 9, day: 8, hour: 4, minute: 30 },   // 백로
      { month: 10, day: 8, hour: 19, minute: 42 },   // 한로
      { month: 11, day: 7, hour: 22, minute: 27 },   // 입동
      { month: 12, day: 7, hour: 14, minute: 58 },   // 대설
      { month: 1, day: 6, hour: 20, minute: 23 },   // 소한
    ],
    1941: [
      { month: 2, day: 4, hour: 13, minute: 50 },   // 입춘
      { month: 3, day: 6, hour: 8, minute: 10 },   // 경칩
      { month: 4, day: 5, hour: 13, minute: 25 },   // 청명
      { month: 5, day: 6, hour: 7, minute: 10 },   // 입하
      { month: 6, day: 6, hour: 11, minute: 39 },   // 망종
      { month: 7, day: 7, hour: 22, minute: 3 },   // 소서
      { month: 8, day: 8, hour: 7, minute: 46 },   // 입추
      { month: 9, day: 8, hour: 10, minute: 24 },   // 백로
      { month: 10, day: 9, hour: 1, minute: 38 },   // 한로
      { month: 11, day: 8, hour: 4, minute: 24 },   // 입동
      { month: 12, day: 7, hour: 20, minute: 56 },   // 대설
      { month: 1, day: 6, hour: 2, minute: 4 },   // 소한
    ],
    1942: [
      { month: 2, day: 4, hour: 19, minute: 48 },   // 입춘
      { month: 3, day: 6, hour: 14, minute: 9 },   // 경칩
      { month: 4, day: 5, hour: 19, minute: 23 },   // 청명
      { month: 5, day: 6, hour: 13, minute: 7 },   // 입하
      { month: 6, day: 6, hour: 17, minute: 32 },   // 망종
      { month: 7, day: 8, hour: 3, minute: 51 },   // 소서
      { month: 8, day: 8, hour: 13, minute: 30 },   // 입추
      { month: 9, day: 8, hour: 16, minute: 7 },   // 백로
      { month: 10, day: 9, hour: 7, minute: 22 },   // 한로
      { month: 11, day: 8, hour: 10, minute: 11 },   // 입동
      { month: 12, day: 8, hour: 2, minute: 47 },   // 대설
      { month: 1, day: 6, hour: 8, minute: 2 },   // 소한
    ],
    1943: [
      { month: 2, day: 5, hour: 1, minute: 40 },   // 입춘
      { month: 3, day: 6, hour: 19, minute: 58 },   // 경칩
      { month: 4, day: 6, hour: 1, minute: 11 },   // 청명
      { month: 5, day: 6, hour: 18, minute: 53 },   // 입하
      { month: 6, day: 6, hour: 23, minute: 19 },   // 망종
      { month: 7, day: 8, hour: 9, minute: 39 },   // 소서
      { month: 8, day: 8, hour: 19, minute: 18 },   // 입추
      { month: 9, day: 8, hour: 21, minute: 55 },   // 백로
      { month: 10, day: 9, hour: 13, minute: 10 },   // 한로
      { month: 11, day: 8, hour: 15, minute: 59 },   // 입동
      { month: 12, day: 8, hour: 8, minute: 33 },   // 대설
      { month: 1, day: 6, hour: 13, minute: 55 },   // 소한
    ],
    1944: [
      { month: 2, day: 5, hour: 7, minute: 23 },   // 입춘
      { month: 3, day: 6, hour: 1, minute: 40 },   // 경칩
      { month: 4, day: 5, hour: 6, minute: 54 },   // 청명
      { month: 5, day: 6, hour: 0, minute: 40 },   // 입하
      { month: 6, day: 6, hour: 5, minute: 11 },   // 망종
      { month: 7, day: 7, hour: 15, minute: 36 },   // 소서
      { month: 8, day: 8, hour: 1, minute: 19 },   // 입추
      { month: 9, day: 8, hour: 3, minute: 56 },   // 백로
      { month: 10, day: 8, hour: 19, minute: 9 },   // 한로
      { month: 11, day: 7, hour: 21, minute: 54 },   // 입동
      { month: 12, day: 7, hour: 14, minute: 27 },   // 대설
      { month: 1, day: 6, hour: 19, minute: 39 },   // 소한
    ],
    1945: [
      { month: 2, day: 4, hour: 13, minute: 19 },   // 입춘
      { month: 3, day: 6, hour: 7, minute: 38 },   // 경칩
      { month: 4, day: 5, hour: 12, minute: 52 },   // 청명
      { month: 5, day: 6, hour: 6, minute: 37 },   // 입하
      { month: 6, day: 6, hour: 11, minute: 6 },   // 망종
      { month: 7, day: 7, hour: 21, minute: 27 },   // 소서
      { month: 8, day: 8, hour: 7, minute: 5 },   // 입추
      { month: 9, day: 8, hour: 9, minute: 38 },   // 백로
      { month: 10, day: 9, hour: 0, minute: 49 },   // 한로
      { month: 11, day: 8, hour: 3, minute: 34 },   // 입동
      { month: 12, day: 7, hour: 20, minute: 8 },   // 대설
      { month: 1, day: 6, hour: 1, minute: 34 },   // 소한
    ],
    1946: [
      { month: 2, day: 4, hour: 19, minute: 3 },   // 입춘
      { month: 3, day: 6, hour: 13, minute: 24 },   // 경칩
      { month: 4, day: 5, hour: 18, minute: 38 },   // 청명
      { month: 5, day: 6, hour: 12, minute: 22 },   // 입하
      { month: 6, day: 6, hour: 16, minute: 49 },   // 망종
      { month: 7, day: 8, hour: 3, minute: 11 },   // 소서
      { month: 8, day: 8, hour: 12, minute: 52 },   // 입추
      { month: 9, day: 8, hour: 15, minute: 28 },   // 백로
      { month: 10, day: 9, hour: 6, minute: 41 },   // 한로
      { month: 11, day: 8, hour: 9, minute: 27 },   // 입동
      { month: 12, day: 8, hour: 2, minute: 0 },   // 대설
      { month: 1, day: 6, hour: 7, minute: 16 },   // 소한
    ],
    1947: [
      { month: 2, day: 5, hour: 0, minute: 51 },   // 입춘
      { month: 3, day: 6, hour: 19, minute: 8 },   // 경칩
      { month: 4, day: 6, hour: 0, minute: 20 },   // 청명
      { month: 5, day: 6, hour: 18, minute: 3 },   // 입하
      { month: 6, day: 6, hour: 22, minute: 32 },   // 망종
      { month: 7, day: 8, hour: 8, minute: 56 },   // 소서
      { month: 8, day: 8, hour: 18, minute: 41 },   // 입추
      { month: 9, day: 8, hour: 21, minute: 21 },   // 백로
      { month: 10, day: 9, hour: 12, minute: 37 },   // 한로
      { month: 11, day: 8, hour: 15, minute: 24 },   // 입동
      { month: 12, day: 8, hour: 7, minute: 56 },   // 대설
      { month: 1, day: 6, hour: 13, minute: 7 },   // 소한
    ],
    1948: [
      { month: 2, day: 5, hour: 6, minute: 42 },   // 입춘
      { month: 3, day: 6, hour: 0, minute: 58 },   // 경칩
      { month: 4, day: 5, hour: 6, minute: 9 },   // 청명
      { month: 5, day: 5, hour: 23, minute: 52 },   // 입하
      { month: 6, day: 6, hour: 4, minute: 20 },   // 망종
      { month: 7, day: 7, hour: 14, minute: 44 },   // 소서
      { month: 8, day: 8, hour: 0, minute: 26 },   // 입추
      { month: 9, day: 8, hour: 3, minute: 5 },   // 백로
      { month: 10, day: 8, hour: 18, minute: 21 },   // 한로
      { month: 11, day: 7, hour: 21, minute: 7 },   // 입동
      { month: 12, day: 7, hour: 13, minute: 38 },   // 대설
      { month: 1, day: 6, hour: 19, minute: 0 },   // 소한
    ],
    1949: [
      { month: 2, day: 4, hour: 12, minute: 23 },   // 입춘
      { month: 3, day: 6, hour: 6, minute: 39 },   // 경칩
      { month: 4, day: 5, hour: 11, minute: 52 },   // 청명
      { month: 5, day: 6, hour: 5, minute: 37 },   // 입하
      { month: 6, day: 6, hour: 10, minute: 7 },   // 망종
      { month: 7, day: 7, hour: 20, minute: 32 },   // 소서
      { month: 8, day: 8, hour: 6, minute: 15 },   // 입추
      { month: 9, day: 8, hour: 8, minute: 54 },   // 백로
      { month: 10, day: 9, hour: 0, minute: 11 },   // 한로
      { month: 11, day: 8, hour: 3, minute: 0 },   // 입동
      { month: 12, day: 7, hour: 19, minute: 33 },   // 대설
      { month: 1, day: 6, hour: 0, minute: 41 },   // 소한
    ],
    1950: [
      { month: 2, day: 4, hour: 18, minute: 20 },   // 입춘
      { month: 3, day: 6, hour: 12, minute: 35 },   // 경칩
      { month: 4, day: 5, hour: 17, minute: 44 },   // 청명
      { month: 5, day: 6, hour: 11, minute: 25 },   // 입하
      { month: 6, day: 6, hour: 15, minute: 51 },   // 망종
      { month: 7, day: 8, hour: 2, minute: 13 },   // 소서
      { month: 8, day: 8, hour: 11, minute: 56 },   // 입추
      { month: 9, day: 8, hour: 14, minute: 34 },   // 백로
      { month: 10, day: 9, hour: 5, minute: 52 },   // 한로
      { month: 11, day: 8, hour: 8, minute: 44 },   // 입동
      { month: 12, day: 8, hour: 1, minute: 22 },   // 대설
      { month: 1, day: 6, hour: 6, minute: 39 },   // 소한
    ],
    1951: [
      { month: 2, day: 5, hour: 0, minute: 13 },   // 입춘
      { month: 3, day: 6, hour: 18, minute: 26 },   // 경칩
      { month: 4, day: 5, hour: 23, minute: 32 },   // 청명
      { month: 5, day: 6, hour: 17, minute: 9 },   // 입하
      { month: 6, day: 6, hour: 21, minute: 33 },   // 망종
      { month: 7, day: 8, hour: 7, minute: 54 },   // 소서
      { month: 8, day: 8, hour: 17, minute: 38 },   // 입추
      { month: 9, day: 8, hour: 20, minute: 18 },   // 백로
      { month: 10, day: 9, hour: 11, minute: 36 },   // 한로
      { month: 11, day: 8, hour: 14, minute: 27 },   // 입동
      { month: 12, day: 8, hour: 7, minute: 2 },   // 대설
      { month: 1, day: 6, hour: 12, minute: 30 },   // 소한
    ],
    1952: [
      { month: 2, day: 5, hour: 5, minute: 53 },   // 입춘
      { month: 3, day: 6, hour: 0, minute: 7 },   // 경칩
      { month: 4, day: 5, hour: 5, minute: 15 },   // 청명
      { month: 5, day: 5, hour: 22, minute: 54 },   // 입하
      { month: 6, day: 6, hour: 3, minute: 20 },   // 망종
      { month: 7, day: 7, hour: 13, minute: 45 },   // 소서
      { month: 8, day: 7, hour: 23, minute: 32 },   // 입추
      { month: 9, day: 8, hour: 2, minute: 14 },   // 백로
      { month: 10, day: 8, hour: 17, minute: 33 },   // 한로
      { month: 11, day: 7, hour: 20, minute: 22 },   // 입동
      { month: 12, day: 7, hour: 12, minute: 56 },   // 대설
      { month: 1, day: 6, hour: 18, minute: 9 },   // 소한
    ],
    1953: [
      { month: 2, day: 4, hour: 11, minute: 46 },   // 입춘
      { month: 3, day: 6, hour: 6, minute: 3 },   // 경칩
      { month: 4, day: 5, hour: 11, minute: 13 },   // 청명
      { month: 5, day: 6, hour: 4, minute: 53 },   // 입하
      { month: 6, day: 6, hour: 9, minute: 16 },   // 망종
      { month: 7, day: 7, hour: 19, minute: 35 },   // 소서
      { month: 8, day: 8, hour: 5, minute: 15 },   // 입추
      { month: 9, day: 8, hour: 7, minute: 53 },   // 백로
      { month: 10, day: 8, hour: 23, minute: 11 },   // 한로
      { month: 11, day: 8, hour: 2, minute: 1 },   // 입동
      { month: 12, day: 7, hour: 18, minute: 37 },   // 대설
      { month: 1, day: 6, hour: 0, minute: 2 },   // 소한
    ],
    1954: [
      { month: 2, day: 4, hour: 17, minute: 30 },   // 입춘
      { month: 3, day: 6, hour: 11, minute: 48 },   // 경칩
      { month: 4, day: 5, hour: 16, minute: 59 },   // 청명
      { month: 5, day: 6, hour: 10, minute: 38 },   // 입하
      { month: 6, day: 6, hour: 15, minute: 1 },   // 망종
      { month: 7, day: 8, hour: 1, minute: 19 },   // 소서
      { month: 8, day: 8, hour: 10, minute: 59 },   // 입추
      { month: 9, day: 8, hour: 13, minute: 38 },   // 백로
      { month: 10, day: 9, hour: 4, minute: 58 },   // 한로
      { month: 11, day: 8, hour: 7, minute: 51 },   // 입동
      { month: 12, day: 8, hour: 0, minute: 28 },   // 대설
      { month: 1, day: 6, hour: 5, minute: 45 },   // 소한
    ],
    1955: [
      { month: 2, day: 4, hour: 23, minute: 18 },   // 입춘
      { month: 3, day: 6, hour: 17, minute: 31 },   // 경칩
      { month: 4, day: 5, hour: 22, minute: 39 },   // 청명
      { month: 5, day: 6, hour: 16, minute: 18 },   // 입하
      { month: 6, day: 6, hour: 20, minute: 44 },   // 망종
      { month: 7, day: 8, hour: 7, minute: 6 },   // 소서
      { month: 8, day: 8, hour: 16, minute: 50 },   // 입추
      { month: 9, day: 8, hour: 19, minute: 32 },   // 백로
      { month: 10, day: 9, hour: 10, minute: 52 },   // 한로
      { month: 11, day: 8, hour: 13, minute: 45 },   // 입동
      { month: 12, day: 8, hour: 6, minute: 23 },   // 대설
      { month: 1, day: 6, hour: 11, minute: 36 },   // 소한
    ],
    1956: [
      { month: 2, day: 5, hour: 5, minute: 12 },   // 입춘
      { month: 3, day: 5, hour: 23, minute: 25 },   // 경칩
      { month: 4, day: 5, hour: 4, minute: 32 },   // 청명
      { month: 5, day: 5, hour: 22, minute: 10 },   // 입하
      { month: 6, day: 6, hour: 2, minute: 36 },   // 망종
      { month: 7, day: 7, hour: 12, minute: 58 },   // 소서
      { month: 8, day: 7, hour: 22, minute: 41 },   // 입추
      { month: 9, day: 8, hour: 1, minute: 20 },   // 백로
      { month: 10, day: 8, hour: 16, minute: 37 },   // 한로
      { month: 11, day: 7, hour: 19, minute: 26 },   // 입동
      { month: 12, day: 7, hour: 12, minute: 3 },   // 대설
      { month: 1, day: 6, hour: 17, minute: 30 },   // 소한
    ],
    1957: [
      { month: 2, day: 4, hour: 10, minute: 55 },   // 입춘
      { month: 3, day: 6, hour: 5, minute: 10 },   // 경칩
      { month: 4, day: 5, hour: 10, minute: 19 },   // 청명
      { month: 5, day: 6, hour: 3, minute: 58 },   // 입하
      { month: 6, day: 6, hour: 8, minute: 25 },   // 망종
      { month: 7, day: 7, hour: 18, minute: 48 },   // 소서
      { month: 8, day: 8, hour: 4, minute: 32 },   // 입추
      { month: 9, day: 8, hour: 7, minute: 12 },   // 백로
      { month: 10, day: 8, hour: 22, minute: 30 },   // 한로
      { month: 11, day: 8, hour: 1, minute: 20 },   // 입동
      { month: 12, day: 7, hour: 17, minute: 56 },   // 대설
      { month: 1, day: 5, hour: 23, minute: 11 },   // 소한
    ],
    1958: [
      { month: 2, day: 4, hour: 16, minute: 49 },   // 입춘
      { month: 3, day: 6, hour: 11, minute: 4 },   // 경칩
      { month: 4, day: 5, hour: 16, minute: 12 },   // 청명
      { month: 5, day: 6, hour: 9, minute: 49 },   // 입하
      { month: 6, day: 6, hour: 14, minute: 12 },   // 망종
      { month: 7, day: 8, hour: 0, minute: 33 },   // 소서
      { month: 8, day: 8, hour: 10, minute: 17 },   // 입추
      { month: 9, day: 8, hour: 12, minute: 59 },   // 백로
      { month: 10, day: 9, hour: 4, minute: 19 },   // 한로
      { month: 11, day: 8, hour: 7, minute: 12 },   // 입동
      { month: 12, day: 7, hour: 23, minute: 50 },   // 대설
      { month: 1, day: 6, hour: 5, minute: 4 },   // 소한
    ],
    1959: [
      { month: 2, day: 4, hour: 22, minute: 42 },   // 입춘
      { month: 3, day: 6, hour: 16, minute: 57 },   // 경칩
      { month: 4, day: 5, hour: 22, minute: 3 },   // 청명
      { month: 5, day: 6, hour: 15, minute: 39 },   // 입하
      { month: 6, day: 6, hour: 20, minute: 0 },   // 망종
      { month: 7, day: 8, hour: 6, minute: 20 },   // 소서
      { month: 8, day: 8, hour: 16, minute: 4 },   // 입추
      { month: 9, day: 8, hour: 18, minute: 48 },   // 백로
      { month: 10, day: 9, hour: 10, minute: 10 },   // 한로
      { month: 11, day: 8, hour: 13, minute: 2 },   // 입동
      { month: 12, day: 8, hour: 5, minute: 37 },   // 대설
      { month: 1, day: 6, hour: 10, minute: 59 },   // 소한
    ],
    1960: [
      { month: 2, day: 5, hour: 4, minute: 23 },   // 입춘
      { month: 3, day: 5, hour: 22, minute: 36 },   // 경칩
      { month: 4, day: 5, hour: 3, minute: 43 },   // 청명
      { month: 5, day: 5, hour: 21, minute: 23 },   // 입하
      { month: 6, day: 6, hour: 1, minute: 49 },   // 망종
      { month: 7, day: 7, hour: 12, minute: 13 },   // 소서
      { month: 8, day: 7, hour: 22, minute: 0 },   // 입추
      { month: 9, day: 8, hour: 0, minute: 45 },   // 백로
      { month: 10, day: 8, hour: 16, minute: 9 },   // 한로
      { month: 11, day: 7, hour: 19, minute: 2 },   // 입동
      { month: 12, day: 7, hour: 11, minute: 37 },   // 대설
      { month: 1, day: 6, hour: 16, minute: 42 },   // 소한
    ],
    1961: [
      { month: 2, day: 4, hour: 10, minute: 22 },   // 입춘
      { month: 3, day: 6, hour: 4, minute: 35 },   // 경칩
      { month: 4, day: 5, hour: 9, minute: 42 },   // 청명
      { month: 5, day: 6, hour: 3, minute: 22 },   // 입하
      { month: 6, day: 6, hour: 7, minute: 46 },   // 망종
      { month: 7, day: 7, hour: 18, minute: 7 },   // 소서
      { month: 8, day: 8, hour: 3, minute: 49 },   // 입추
      { month: 9, day: 8, hour: 6, minute: 29 },   // 백로
      { month: 10, day: 8, hour: 21, minute: 51 },   // 한로
      { month: 11, day: 8, hour: 0, minute: 46 },   // 입동
      { month: 12, day: 7, hour: 17, minute: 26 },   // 대설
      { month: 1, day: 5, hour: 22, minute: 42 },   // 소한
    ],
    1962: [
      { month: 2, day: 4, hour: 16, minute: 17 },   // 입춘
      { month: 3, day: 6, hour: 10, minute: 29 },   // 경칩
      { month: 4, day: 5, hour: 15, minute: 34 },   // 청명
      { month: 5, day: 6, hour: 9, minute: 10 },   // 입하
      { month: 6, day: 6, hour: 13, minute: 32 },   // 망종
      { month: 7, day: 7, hour: 23, minute: 51 },   // 소서
      { month: 8, day: 8, hour: 9, minute: 34 },   // 입추
      { month: 9, day: 8, hour: 12, minute: 16 },   // 백로
      { month: 10, day: 9, hour: 3, minute: 38 },   // 한로
      { month: 11, day: 8, hour: 6, minute: 35 },   // 입동
      { month: 12, day: 7, hour: 23, minute: 16 },   // 대설
      { month: 1, day: 6, hour: 4, minute: 35 },   // 소한
    ],
    1963: [
      { month: 2, day: 4, hour: 22, minute: 8 },   // 입춘
      { month: 3, day: 6, hour: 16, minute: 17 },   // 경칩
      { month: 4, day: 5, hour: 21, minute: 19 },   // 청명
      { month: 5, day: 6, hour: 14, minute: 52 },   // 입하
      { month: 6, day: 6, hour: 19, minute: 14 },   // 망종
      { month: 7, day: 8, hour: 5, minute: 38 },   // 소서
      { month: 8, day: 8, hour: 15, minute: 25 },   // 입추
      { month: 9, day: 8, hour: 18, minute: 12 },   // 백로
      { month: 10, day: 9, hour: 9, minute: 36 },   // 한로
      { month: 11, day: 8, hour: 12, minute: 32 },   // 입동
      { month: 12, day: 8, hour: 5, minute: 13 },   // 대설
      { month: 1, day: 6, hour: 10, minute: 26 },   // 소한
    ],
    1964: [
      { month: 2, day: 5, hour: 4, minute: 5 },   // 입춘
      { month: 3, day: 5, hour: 22, minute: 16 },   // 경칩
      { month: 4, day: 5, hour: 3, minute: 18 },   // 청명
      { month: 5, day: 5, hour: 20, minute: 51 },   // 입하
      { month: 6, day: 6, hour: 1, minute: 12 },   // 망종
      { month: 7, day: 7, hour: 11, minute: 32 },   // 소서
      { month: 8, day: 7, hour: 21, minute: 17 },   // 입추
      { month: 9, day: 8, hour: 0, minute: 0 },   // 백로
      { month: 10, day: 8, hour: 15, minute: 22 },   // 한로
      { month: 11, day: 7, hour: 18, minute: 15 },   // 입동
      { month: 12, day: 7, hour: 10, minute: 53 },   // 대설
      { month: 1, day: 6, hour: 16, minute: 22 },   // 소한
    ],
    1965: [
      { month: 2, day: 4, hour: 9, minute: 46 },   // 입춘
      { month: 3, day: 6, hour: 4, minute: 1 },   // 경칩
      { month: 4, day: 5, hour: 9, minute: 7 },   // 청명
      { month: 5, day: 6, hour: 2, minute: 42 },   // 입하
      { month: 6, day: 6, hour: 7, minute: 2 },   // 망종
      { month: 7, day: 7, hour: 17, minute: 21 },   // 소서
      { month: 8, day: 8, hour: 3, minute: 4 },   // 입추
      { month: 9, day: 8, hour: 5, minute: 48 },   // 백로
      { month: 10, day: 8, hour: 21, minute: 11 },   // 한로
      { month: 11, day: 8, hour: 0, minute: 6 },   // 입동
      { month: 12, day: 7, hour: 16, minute: 45 },   // 대설
      { month: 1, day: 5, hour: 22, minute: 2 },   // 소한
    ],
    1966: [
      { month: 2, day: 4, hour: 15, minute: 37 },   // 입춘
      { month: 3, day: 6, hour: 9, minute: 51 },   // 경칩
      { month: 4, day: 5, hour: 14, minute: 56 },   // 청명
      { month: 5, day: 6, hour: 8, minute: 30 },   // 입하
      { month: 6, day: 6, hour: 12, minute: 50 },   // 망종
      { month: 7, day: 7, hour: 23, minute: 7 },   // 소서
      { month: 8, day: 8, hour: 8, minute: 49 },   // 입추
      { month: 9, day: 8, hour: 11, minute: 32 },   // 백로
      { month: 10, day: 9, hour: 2, minute: 57 },   // 한로
      { month: 11, day: 8, hour: 5, minute: 55 },   // 입동
      { month: 12, day: 7, hour: 22, minute: 38 },   // 대설
      { month: 1, day: 6, hour: 3, minute: 54 },   // 소한
    ],
    1967: [
      { month: 2, day: 4, hour: 21, minute: 30 },   // 입춘
      { month: 3, day: 6, hour: 15, minute: 42 },   // 경칩
      { month: 4, day: 5, hour: 20, minute: 45 },   // 청명
      { month: 5, day: 6, hour: 14, minute: 17 },   // 입하
      { month: 6, day: 6, hour: 18, minute: 37 },   // 망종
      { month: 7, day: 8, hour: 4, minute: 54 },   // 소서
      { month: 8, day: 8, hour: 14, minute: 35 },   // 입추
      { month: 9, day: 8, hour: 17, minute: 18 },   // 백로
      { month: 10, day: 9, hour: 8, minute: 41 },   // 한로
      { month: 11, day: 8, hour: 11, minute: 37 },   // 입동
      { month: 12, day: 8, hour: 4, minute: 17 },   // 대설
      { month: 1, day: 6, hour: 9, minute: 48 },   // 소한
    ],
    1968: [
      { month: 2, day: 5, hour: 3, minute: 7 },   // 입춘
      { month: 3, day: 5, hour: 21, minute: 17 },   // 경칩
      { month: 4, day: 5, hour: 2, minute: 21 },   // 청명
      { month: 5, day: 5, hour: 19, minute: 56 },   // 입하
      { month: 6, day: 6, hour: 0, minute: 19 },   // 망종
      { month: 7, day: 7, hour: 10, minute: 42 },   // 소서
      { month: 8, day: 7, hour: 20, minute: 27 },   // 입추
      { month: 9, day: 7, hour: 23, minute: 12 },   // 백로
      { month: 10, day: 8, hour: 14, minute: 35 },   // 한로
      { month: 11, day: 7, hour: 17, minute: 29 },   // 입동
      { month: 12, day: 7, hour: 10, minute: 8 },   // 대설
      { month: 1, day: 6, hour: 15, minute: 26 },   // 소한
    ],
    1969: [
      { month: 2, day: 4, hour: 8, minute: 59 },   // 입춘
      { month: 3, day: 6, hour: 3, minute: 11 },   // 경칩
      { month: 4, day: 5, hour: 8, minute: 15 },   // 청명
      { month: 5, day: 6, hour: 1, minute: 50 },   // 입하
      { month: 6, day: 6, hour: 6, minute: 12 },   // 망종
      { month: 7, day: 7, hour: 16, minute: 32 },   // 소서
      { month: 8, day: 8, hour: 2, minute: 14 },   // 입추
      { month: 9, day: 8, hour: 4, minute: 55 },   // 백로
      { month: 10, day: 8, hour: 20, minute: 16 },   // 한로
      { month: 11, day: 7, hour: 23, minute: 12 },   // 입동
      { month: 12, day: 7, hour: 15, minute: 51 },   // 대설
      { month: 1, day: 5, hour: 21, minute: 17 },   // 소한
    ],
    1970: [
      { month: 2, day: 4, hour: 14, minute: 45 },   // 입춘
      { month: 3, day: 6, hour: 8, minute: 58 },   // 경칩
      { month: 4, day: 5, hour: 14, minute: 2 },   // 청명
      { month: 5, day: 6, hour: 7, minute: 34 },   // 입하
      { month: 6, day: 6, hour: 11, minute: 52 },   // 망종
      { month: 7, day: 7, hour: 22, minute: 11 },   // 소서
      { month: 8, day: 8, hour: 7, minute: 54 },   // 입추
      { month: 9, day: 8, hour: 10, minute: 38 },   // 백로
      { month: 10, day: 9, hour: 2, minute: 2 },   // 한로
      { month: 11, day: 8, hour: 4, minute: 58 },   // 입동
      { month: 12, day: 7, hour: 21, minute: 37 },   // 대설
      { month: 1, day: 6, hour: 3, minute: 2 },   // 소한
    ],
    1971: [
      { month: 2, day: 4, hour: 20, minute: 26 },   // 입춘
      { month: 3, day: 6, hour: 14, minute: 35 },   // 경칩
      { month: 4, day: 5, hour: 19, minute: 36 },   // 청명
      { month: 5, day: 6, hour: 13, minute: 8 },   // 입하
      { month: 6, day: 6, hour: 17, minute: 29 },   // 망종
      { month: 7, day: 8, hour: 3, minute: 51 },   // 소서
      { month: 8, day: 8, hour: 13, minute: 40 },   // 입추
      { month: 9, day: 8, hour: 16, minute: 30 },   // 백로
      { month: 10, day: 9, hour: 7, minute: 58 },   // 한로
      { month: 11, day: 8, hour: 10, minute: 56 },   // 입동
      { month: 12, day: 8, hour: 3, minute: 35 },   // 대설
      { month: 1, day: 6, hour: 8, minute: 46 },   // 소한
    ],
    1972: [
      { month: 2, day: 5, hour: 2, minute: 20 },   // 입춘
      { month: 3, day: 5, hour: 20, minute: 28 },   // 경칩
      { month: 4, day: 5, hour: 1, minute: 28 },   // 청명
      { month: 5, day: 5, hour: 19, minute: 1 },   // 입하
      { month: 6, day: 5, hour: 23, minute: 22 },   // 망종
      { month: 7, day: 7, hour: 9, minute: 43 },   // 소서
      { month: 8, day: 7, hour: 19, minute: 29 },   // 입추
      { month: 9, day: 7, hour: 22, minute: 15 },   // 백로
      { month: 10, day: 8, hour: 13, minute: 42 },   // 한로
      { month: 11, day: 7, hour: 16, minute: 39 },   // 입동
      { month: 12, day: 7, hour: 9, minute: 19 },   // 대설
      { month: 1, day: 6, hour: 14, minute: 41 },   // 소한
    ],
    1973: [
      { month: 2, day: 4, hour: 8, minute: 4 },   // 입춘
      { month: 3, day: 6, hour: 2, minute: 12 },   // 경칩
      { month: 4, day: 5, hour: 7, minute: 13 },   // 청명
      { month: 5, day: 6, hour: 0, minute: 46 },   // 입하
      { month: 6, day: 6, hour: 5, minute: 7 },   // 망종
      { month: 7, day: 7, hour: 15, minute: 27 },   // 소서
      { month: 8, day: 8, hour: 1, minute: 13 },   // 입추
      { month: 9, day: 8, hour: 3, minute: 59 },   // 백로
      { month: 10, day: 8, hour: 19, minute: 27 },   // 한로
      { month: 11, day: 7, hour: 22, minute: 28 },   // 입동
      { month: 12, day: 7, hour: 15, minute: 11 },   // 대설
      { month: 1, day: 5, hour: 20, minute: 25 },   // 소한
    ],
    1974: [
      { month: 2, day: 4, hour: 14, minute: 0 },   // 입춘
      { month: 3, day: 6, hour: 8, minute: 7 },   // 경칩
      { month: 4, day: 5, hour: 13, minute: 5 },   // 청명
      { month: 5, day: 6, hour: 6, minute: 34 },   // 입하
      { month: 6, day: 6, hour: 10, minute: 51 },   // 망종
      { month: 7, day: 7, hour: 21, minute: 11 },   // 소서
      { month: 8, day: 8, hour: 6, minute: 57 },   // 입추
      { month: 9, day: 8, hour: 9, minute: 45 },   // 백로
      { month: 10, day: 9, hour: 1, minute: 15 },   // 한로
      { month: 11, day: 8, hour: 4, minute: 18 },   // 입동
      { month: 12, day: 7, hour: 21, minute: 4 },   // 대설
      { month: 1, day: 6, hour: 2, minute: 20 },   // 소한
    ],
    1975: [
      { month: 2, day: 4, hour: 19, minute: 59 },   // 입춘
      { month: 3, day: 6, hour: 14, minute: 6 },   // 경칩
      { month: 4, day: 5, hour: 19, minute: 1 },   // 청명
      { month: 5, day: 6, hour: 12, minute: 27 },   // 입하
      { month: 6, day: 6, hour: 16, minute: 42 },   // 망종
      { month: 7, day: 8, hour: 2, minute: 59 },   // 소서
      { month: 8, day: 8, hour: 12, minute: 45 },   // 입추
      { month: 9, day: 8, hour: 15, minute: 33 },   // 백로
      { month: 10, day: 9, hour: 7, minute: 2 },   // 한로
      { month: 11, day: 8, hour: 10, minute: 2 },   // 입동
      { month: 12, day: 8, hour: 2, minute: 46 },   // 대설
      { month: 1, day: 6, hour: 8, minute: 17 },   // 소한
    ],
    1976: [
      { month: 2, day: 5, hour: 1, minute: 39 },   // 입춘
      { month: 3, day: 5, hour: 19, minute: 48 },   // 경칩
      { month: 4, day: 5, hour: 0, minute: 46 },   // 청명
      { month: 5, day: 5, hour: 18, minute: 14 },   // 입하
      { month: 6, day: 5, hour: 22, minute: 31 },   // 망종
      { month: 7, day: 7, hour: 8, minute: 51 },   // 소서
      { month: 8, day: 7, hour: 18, minute: 39 },   // 입추
      { month: 9, day: 7, hour: 21, minute: 28 },   // 백로
      { month: 10, day: 8, hour: 12, minute: 58 },   // 한로
      { month: 11, day: 7, hour: 15, minute: 58 },   // 입동
      { month: 12, day: 7, hour: 8, minute: 40 },   // 대설
      { month: 1, day: 6, hour: 13, minute: 57 },   // 소한
    ],
    1977: [
      { month: 2, day: 4, hour: 7, minute: 33 },   // 입춘
      { month: 3, day: 6, hour: 1, minute: 44 },   // 경칩
      { month: 4, day: 5, hour: 6, minute: 46 },   // 청명
      { month: 5, day: 6, hour: 0, minute: 16 },   // 입하
      { month: 6, day: 6, hour: 4, minute: 32 },   // 망종
      { month: 7, day: 7, hour: 14, minute: 48 },   // 소서
      { month: 8, day: 8, hour: 0, minute: 30 },   // 입추
      { month: 9, day: 8, hour: 3, minute: 16 },   // 백로
      { month: 10, day: 8, hour: 18, minute: 44 },   // 한로
      { month: 11, day: 7, hour: 21, minute: 46 },   // 입동
      { month: 12, day: 7, hour: 14, minute: 30 },   // 대설
      { month: 1, day: 5, hour: 19, minute: 51 },   // 소한
    ],
    1978: [
      { month: 2, day: 4, hour: 13, minute: 26 },   // 입춘
      { month: 3, day: 6, hour: 7, minute: 38 },   // 경칩
      { month: 4, day: 5, hour: 12, minute: 39 },   // 청명
      { month: 5, day: 6, hour: 6, minute: 9 },   // 입하
      { month: 6, day: 6, hour: 10, minute: 23 },   // 망종
      { month: 7, day: 7, hour: 20, minute: 37 },   // 소서
      { month: 8, day: 8, hour: 6, minute: 18 },   // 입추
      { month: 9, day: 8, hour: 9, minute: 3 },   // 백로
      { month: 10, day: 9, hour: 0, minute: 31 },   // 한로
      { month: 11, day: 8, hour: 3, minute: 34 },   // 입동
      { month: 12, day: 7, hour: 20, minute: 20 },   // 대설
      { month: 1, day: 6, hour: 1, minute: 43 },   // 소한
    ],
    1979: [
      { month: 2, day: 4, hour: 19, minute: 13 },   // 입춘
      { month: 3, day: 6, hour: 13, minute: 20 },   // 경칩
      { month: 4, day: 5, hour: 18, minute: 18 },   // 청명
      { month: 5, day: 6, hour: 11, minute: 47 },   // 입하
      { month: 6, day: 6, hour: 16, minute: 5 },   // 망종
      { month: 7, day: 8, hour: 2, minute: 25 },   // 소서
      { month: 8, day: 8, hour: 12, minute: 11 },   // 입추
      { month: 9, day: 8, hour: 15, minute: 0 },   // 백로
      { month: 10, day: 9, hour: 6, minute: 30 },   // 한로
      { month: 11, day: 8, hour: 9, minute: 33 },   // 입동
      { month: 12, day: 8, hour: 2, minute: 18 },   // 대설
      { month: 1, day: 6, hour: 7, minute: 32 },   // 소한
    ],
    1980: [
      { month: 2, day: 5, hour: 1, minute: 9 },   // 입춘
      { month: 3, day: 5, hour: 19, minute: 17 },   // 경칩
      { month: 4, day: 5, hour: 0, minute: 15 },   // 청명
      { month: 5, day: 5, hour: 17, minute: 45 },   // 입하
      { month: 6, day: 5, hour: 22, minute: 4 },   // 망종
      { month: 7, day: 7, hour: 8, minute: 24 },   // 소서
      { month: 8, day: 7, hour: 18, minute: 9 },   // 입추
      { month: 9, day: 7, hour: 20, minute: 54 },   // 백로
      { month: 10, day: 8, hour: 12, minute: 19 },   // 한로
      { month: 11, day: 7, hour: 15, minute: 18 },   // 입동
      { month: 12, day: 7, hour: 8, minute: 1 },   // 대설
      { month: 1, day: 6, hour: 13, minute: 29 },   // 소한
    ],
    1981: [
      { month: 2, day: 4, hour: 6, minute: 55 },   // 입춘
      { month: 3, day: 6, hour: 1, minute: 5 },   // 경칩
      { month: 4, day: 5, hour: 6, minute: 5 },   // 청명
      { month: 5, day: 5, hour: 23, minute: 35 },   // 입하
      { month: 6, day: 6, hour: 3, minute: 53 },   // 망종
      { month: 7, day: 7, hour: 14, minute: 12 },   // 소서
      { month: 8, day: 7, hour: 23, minute: 57 },   // 입추
      { month: 9, day: 8, hour: 2, minute: 43 },   // 백로
      { month: 10, day: 8, hour: 18, minute: 9 },   // 한로
      { month: 11, day: 7, hour: 21, minute: 8 },   // 입동
      { month: 12, day: 7, hour: 13, minute: 51 },   // 대설
      { month: 1, day: 5, hour: 19, minute: 13 },   // 소한
    ],
    1982: [
      { month: 2, day: 4, hour: 12, minute: 45 },   // 입춘
      { month: 3, day: 6, hour: 6, minute: 54 },   // 경칩
      { month: 4, day: 5, hour: 11, minute: 53 },   // 청명
      { month: 5, day: 6, hour: 5, minute: 20 },   // 입하
      { month: 6, day: 6, hour: 9, minute: 36 },   // 망종
      { month: 7, day: 7, hour: 19, minute: 55 },   // 소서
      { month: 8, day: 8, hour: 5, minute: 42 },   // 입추
      { month: 9, day: 8, hour: 8, minute: 32 },   // 백로
      { month: 10, day: 9, hour: 0, minute: 2 },   // 한로
      { month: 11, day: 8, hour: 3, minute: 4 },   // 입동
      { month: 12, day: 7, hour: 19, minute: 48 },   // 대설
      { month: 1, day: 6, hour: 1, minute: 2 },   // 소한
    ],
    1983: [
      { month: 2, day: 4, hour: 18, minute: 40 },   // 입춘
      { month: 3, day: 6, hour: 12, minute: 47 },   // 경칩
      { month: 4, day: 5, hour: 17, minute: 44 },   // 청명
      { month: 5, day: 6, hour: 11, minute: 11 },   // 입하
      { month: 6, day: 6, hour: 15, minute: 26 },   // 망종
      { month: 7, day: 8, hour: 1, minute: 43 },   // 소서
      { month: 8, day: 8, hour: 11, minute: 29 },   // 입추
      { month: 9, day: 8, hour: 14, minute: 20 },   // 백로
      { month: 10, day: 9, hour: 5, minute: 51 },   // 한로
      { month: 11, day: 8, hour: 8, minute: 52 },   // 입동
      { month: 12, day: 8, hour: 1, minute: 34 },   // 대설
      { month: 1, day: 6, hour: 6, minute: 59 },   // 소한
    ],
    1984: [
      { month: 2, day: 5, hour: 0, minute: 18 },   // 입춘
      { month: 3, day: 5, hour: 18, minute: 24 },   // 경칩
      { month: 4, day: 4, hour: 23, minute: 22 },   // 청명
      { month: 5, day: 5, hour: 16, minute: 51 },   // 입하
      { month: 6, day: 5, hour: 21, minute: 9 },   // 망종
      { month: 7, day: 7, hour: 7, minute: 29 },   // 소서
      { month: 8, day: 7, hour: 17, minute: 18 },   // 입추
      { month: 9, day: 7, hour: 20, minute: 10 },   // 백로
      { month: 10, day: 8, hour: 11, minute: 43 },   // 한로
      { month: 11, day: 7, hour: 14, minute: 45 },   // 입동
      { month: 12, day: 7, hour: 7, minute: 28 },   // 대설
      { month: 1, day: 6, hour: 12, minute: 41 },   // 소한
    ],
    1985: [
      { month: 2, day: 4, hour: 6, minute: 12 },   // 입춘
      { month: 3, day: 6, hour: 0, minute: 17 },   // 경칩
      { month: 4, day: 5, hour: 5, minute: 14 },   // 청명
      { month: 5, day: 5, hour: 22, minute: 43 },   // 입하
      { month: 6, day: 6, hour: 3, minute: 0 },   // 망종
      { month: 7, day: 7, hour: 13, minute: 19 },   // 소서
      { month: 8, day: 7, hour: 23, minute: 4 },   // 입추
      { month: 9, day: 8, hour: 1, minute: 53 },   // 백로
      { month: 10, day: 8, hour: 17, minute: 24 },   // 한로
      { month: 11, day: 7, hour: 20, minute: 30 },   // 입동
      { month: 12, day: 7, hour: 13, minute: 16 },   // 대설
      { month: 1, day: 5, hour: 18, minute: 35 },   // 소한
    ],
    1986: [
      { month: 2, day: 4, hour: 12, minute: 8 },   // 입춘
      { month: 3, day: 6, hour: 6, minute: 12 },   // 경칩
      { month: 4, day: 5, hour: 11, minute: 6 },   // 청명
      { month: 5, day: 6, hour: 4, minute: 30 },   // 입하
      { month: 6, day: 6, hour: 8, minute: 44 },   // 망종
      { month: 7, day: 7, hour: 19, minute: 1 },   // 소서
      { month: 8, day: 8, hour: 4, minute: 46 },   // 입추
      { month: 9, day: 8, hour: 7, minute: 35 },   // 백로
      { month: 10, day: 8, hour: 23, minute: 7 },   // 한로
      { month: 11, day: 8, hour: 2, minute: 13 },   // 입동
      { month: 12, day: 7, hour: 19, minute: 1 },   // 대설
      { month: 1, day: 6, hour: 0, minute: 28 },   // 소한
    ],
    1987: [
      { month: 2, day: 4, hour: 17, minute: 52 },   // 입춘
      { month: 3, day: 6, hour: 11, minute: 54 },   // 경칩
      { month: 4, day: 5, hour: 16, minute: 44 },   // 청명
      { month: 5, day: 6, hour: 10, minute: 6 },   // 입하
      { month: 6, day: 6, hour: 14, minute: 19 },   // 망종
      { month: 7, day: 8, hour: 0, minute: 39 },   // 소서
      { month: 8, day: 8, hour: 10, minute: 29 },   // 입추
      { month: 9, day: 8, hour: 13, minute: 24 },   // 백로
      { month: 10, day: 9, hour: 4, minute: 59 },   // 한로
      { month: 11, day: 8, hour: 8, minute: 5 },   // 입동
      { month: 12, day: 8, hour: 0, minute: 52 },   // 대설
      { month: 1, day: 6, hour: 6, minute: 13 },   // 소한
    ],
    1988: [
      { month: 2, day: 4, hour: 23, minute: 43 },   // 입춘
      { month: 3, day: 5, hour: 17, minute: 47 },   // 경칩
      { month: 4, day: 4, hour: 22, minute: 40 },   // 청명
      { month: 5, day: 5, hour: 16, minute: 2 },   // 입하
      { month: 6, day: 5, hour: 20, minute: 15 },   // 망종
      { month: 7, day: 7, hour: 6, minute: 33 },   // 소서
      { month: 8, day: 7, hour: 16, minute: 21 },   // 입추
      { month: 9, day: 7, hour: 19, minute: 12 },   // 백로
      { month: 10, day: 8, hour: 10, minute: 45 },   // 한로
      { month: 11, day: 7, hour: 13, minute: 49 },   // 입동
      { month: 12, day: 7, hour: 6, minute: 35 },   // 대설
      { month: 1, day: 6, hour: 12, minute: 3 },   // 소한
    ],
    1989: [
      { month: 2, day: 4, hour: 5, minute: 27 },   // 입춘
      { month: 3, day: 5, hour: 23, minute: 34 },   // 경칩
      { month: 4, day: 5, hour: 4, minute: 30 },   // 청명
      { month: 5, day: 5, hour: 21, minute: 54 },   // 입하
      { month: 6, day: 6, hour: 2, minute: 5 },   // 망종
      { month: 7, day: 7, hour: 12, minute: 19 },   // 소서
      { month: 8, day: 7, hour: 22, minute: 4 },   // 입추
      { month: 9, day: 8, hour: 0, minute: 54 },   // 백로
      { month: 10, day: 8, hour: 16, minute: 27 },   // 한로
      { month: 11, day: 7, hour: 19, minute: 34 },   // 입동
      { month: 12, day: 7, hour: 12, minute: 21 },   // 대설
      { month: 1, day: 5, hour: 17, minute: 46 },   // 소한
    ],
    1990: [
      { month: 2, day: 4, hour: 11, minute: 14 },   // 입춘
      { month: 3, day: 6, hour: 5, minute: 19 },   // 경칩
      { month: 4, day: 5, hour: 10, minute: 13 },   // 청명
      { month: 5, day: 6, hour: 3, minute: 35 },   // 입하
      { month: 6, day: 6, hour: 7, minute: 46 },   // 망종
      { month: 7, day: 7, hour: 18, minute: 0 },   // 소서
      { month: 8, day: 8, hour: 3, minute: 45 },   // 입추
      { month: 9, day: 8, hour: 6, minute: 38 },   // 백로
      { month: 10, day: 8, hour: 22, minute: 14 },   // 한로
      { month: 11, day: 8, hour: 1, minute: 23 },   // 입동
      { month: 12, day: 7, hour: 18, minute: 14 },   // 대설
      { month: 1, day: 5, hour: 23, minute: 33 },   // 소한
    ],
    1991: [
      { month: 2, day: 4, hour: 17, minute: 9 },   // 입춘
      { month: 3, day: 6, hour: 11, minute: 12 },   // 경칩
      { month: 4, day: 5, hour: 16, minute: 5 },   // 청명
      { month: 5, day: 6, hour: 9, minute: 27 },   // 입하
      { month: 6, day: 6, hour: 13, minute: 38 },   // 망종
      { month: 7, day: 7, hour: 23, minute: 53 },   // 소서
      { month: 8, day: 8, hour: 9, minute: 37 },   // 입추
      { month: 9, day: 8, hour: 12, minute: 27 },   // 백로
      { month: 10, day: 9, hour: 4, minute: 1 },   // 한로
      { month: 11, day: 8, hour: 7, minute: 8 },   // 입동
      { month: 12, day: 7, hour: 23, minute: 56 },   // 대설
      { month: 1, day: 6, hour: 5, minute: 28 },   // 소한
    ],
    1992: [
      { month: 2, day: 4, hour: 22, minute: 48 },   // 입춘
      { month: 3, day: 5, hour: 16, minute: 52 },   // 경칩
      { month: 4, day: 4, hour: 21, minute: 45 },   // 청명
      { month: 5, day: 5, hour: 15, minute: 9 },   // 입하
      { month: 6, day: 5, hour: 19, minute: 22 },   // 망종
      { month: 7, day: 7, hour: 5, minute: 40 },   // 소서
      { month: 8, day: 7, hour: 15, minute: 28 },   // 입추
      { month: 9, day: 7, hour: 18, minute: 18 },   // 백로
      { month: 10, day: 8, hour: 9, minute: 51 },   // 한로
      { month: 11, day: 7, hour: 12, minute: 57 },   // 입동
      { month: 12, day: 7, hour: 5, minute: 44 },   // 대설
      { month: 1, day: 6, hour: 11, minute: 8 },   // 소한
    ],
    1993: [
      { month: 2, day: 4, hour: 4, minute: 37 },   // 입춘
      { month: 3, day: 5, hour: 22, minute: 43 },   // 경칩
      { month: 4, day: 5, hour: 3, minute: 37 },   // 청명
      { month: 5, day: 5, hour: 21, minute: 2 },   // 입하
      { month: 6, day: 6, hour: 1, minute: 16 },   // 망종
      { month: 7, day: 7, hour: 11, minute: 32 },   // 소서
      { month: 8, day: 7, hour: 21, minute: 18 },   // 입추
      { month: 9, day: 8, hour: 0, minute: 8 },   // 백로
      { month: 10, day: 8, hour: 15, minute: 40 },   // 한로
      { month: 11, day: 7, hour: 18, minute: 46 },   // 입동
      { month: 12, day: 7, hour: 11, minute: 34 },   // 대설
      { month: 1, day: 5, hour: 16, minute: 56 },   // 소한
    ],
    1994: [
      { month: 2, day: 4, hour: 10, minute: 31 },   // 입춘
      { month: 3, day: 6, hour: 4, minute: 37 },   // 경칩
      { month: 4, day: 5, hour: 9, minute: 32 },   // 청명
      { month: 5, day: 6, hour: 2, minute: 54 },   // 입하
      { month: 6, day: 6, hour: 7, minute: 5 },   // 망종
      { month: 7, day: 7, hour: 17, minute: 20 },   // 소서
      { month: 8, day: 8, hour: 3, minute: 5 },   // 입추
      { month: 9, day: 8, hour: 5, minute: 56 },   // 백로
      { month: 10, day: 8, hour: 21, minute: 30 },   // 한로
      { month: 11, day: 8, hour: 0, minute: 36 },   // 입동
      { month: 12, day: 7, hour: 17, minute: 23 },   // 대설
      { month: 1, day: 5, hour: 22, minute: 48 },   // 소한
    ],
    1995: [
      { month: 2, day: 4, hour: 16, minute: 13 },   // 입춘
      { month: 3, day: 6, hour: 10, minute: 16 },   // 경칩
      { month: 4, day: 5, hour: 15, minute: 8 },   // 청명
      { month: 5, day: 6, hour: 8, minute: 30 },   // 입하
      { month: 6, day: 6, hour: 12, minute: 42 },   // 망종
      { month: 7, day: 7, hour: 23, minute: 1 },   // 소서
      { month: 8, day: 8, hour: 8, minute: 51 },   // 입추
      { month: 9, day: 8, hour: 11, minute: 48 },   // 백로
      { month: 10, day: 9, hour: 3, minute: 27 },   // 한로
      { month: 11, day: 8, hour: 6, minute: 36 },   // 입동
      { month: 12, day: 7, hour: 23, minute: 22 },   // 대설
      { month: 1, day: 6, hour: 4, minute: 34 },   // 소한
    ],
    1996: [
      { month: 2, day: 4, hour: 22, minute: 8 },   // 입춘
      { month: 3, day: 5, hour: 16, minute: 10 },   // 경칩
      { month: 4, day: 4, hour: 21, minute: 2 },   // 청명
      { month: 5, day: 5, hour: 14, minute: 26 },   // 입하
      { month: 6, day: 5, hour: 18, minute: 41 },   // 망종
      { month: 7, day: 7, hour: 5, minute: 0 },   // 소서
      { month: 8, day: 7, hour: 14, minute: 49 },   // 입추
      { month: 9, day: 7, hour: 17, minute: 43 },   // 백로
      { month: 10, day: 8, hour: 9, minute: 19 },   // 한로
      { month: 11, day: 7, hour: 12, minute: 27 },   // 입동
      { month: 12, day: 7, hour: 5, minute: 14 },   // 대설
      { month: 1, day: 6, hour: 10, minute: 32 },   // 소한
    ],
    1997: [
      { month: 2, day: 4, hour: 4, minute: 2 },   // 입춘
      { month: 3, day: 5, hour: 22, minute: 4 },   // 경칩
      { month: 4, day: 5, hour: 2, minute: 56 },   // 청명
      { month: 5, day: 5, hour: 20, minute: 19 },   // 입하
      { month: 6, day: 6, hour: 0, minute: 33 },   // 망종
      { month: 7, day: 7, hour: 10, minute: 49 },   // 소서
      { month: 8, day: 7, hour: 20, minute: 36 },   // 입추
      { month: 9, day: 7, hour: 23, minute: 29 },   // 백로
      { month: 10, day: 8, hour: 15, minute: 5 },   // 한로
      { month: 11, day: 7, hour: 18, minute: 15 },   // 입동
      { month: 12, day: 7, hour: 11, minute: 5 },   // 대설
      { month: 1, day: 5, hour: 16, minute: 25 },   // 소한
    ],
    1998: [
      { month: 2, day: 4, hour: 9, minute: 57 },   // 입춘
      { month: 3, day: 6, hour: 3, minute: 57 },   // 경칩
      { month: 4, day: 5, hour: 8, minute: 45 },   // 청명
      { month: 5, day: 6, hour: 2, minute: 3 },   // 입하
      { month: 6, day: 6, hour: 6, minute: 13 },   // 망종
      { month: 7, day: 7, hour: 16, minute: 30 },   // 소서
      { month: 8, day: 8, hour: 2, minute: 20 },   // 입추
      { month: 9, day: 8, hour: 5, minute: 16 },   // 백로
      { month: 10, day: 8, hour: 20, minute: 56 },   // 한로
      { month: 11, day: 8, hour: 0, minute: 8 },   // 입동
      { month: 12, day: 7, hour: 17, minute: 1 },   // 대설
      { month: 1, day: 5, hour: 22, minute: 18 },   // 소한
    ],
    1999: [
      { month: 2, day: 4, hour: 15, minute: 57 },   // 입춘
      { month: 3, day: 6, hour: 9, minute: 58 },   // 경칩
      { month: 4, day: 5, hour: 14, minute: 45 },   // 청명
      { month: 5, day: 6, hour: 8, minute: 1 },   // 입하
      { month: 6, day: 6, hour: 12, minute: 9 },   // 망종
      { month: 7, day: 7, hour: 22, minute: 25 },   // 소서
      { month: 8, day: 8, hour: 8, minute: 14 },   // 입추
      { month: 9, day: 8, hour: 11, minute: 10 },   // 백로
      { month: 10, day: 9, hour: 2, minute: 49 },   // 한로
      { month: 11, day: 8, hour: 5, minute: 58 },   // 입동
      { month: 12, day: 7, hour: 22, minute: 48 },   // 대설
      { month: 1, day: 6, hour: 4, minute: 17 },   // 소한
    ],
    2000: [
      { month: 2, day: 4, hour: 21, minute: 40 },   // 입춘
      { month: 3, day: 5, hour: 15, minute: 43 },   // 경칩
      { month: 4, day: 4, hour: 20, minute: 32 },   // 청명
      { month: 5, day: 5, hour: 13, minute: 50 },   // 입하
      { month: 6, day: 5, hour: 17, minute: 58 },   // 망종
      { month: 7, day: 7, hour: 4, minute: 14 },   // 소서
      { month: 8, day: 7, hour: 14, minute: 3 },   // 입추
      { month: 9, day: 7, hour: 16, minute: 59 },   // 백로
      { month: 10, day: 8, hour: 8, minute: 38 },   // 한로
      { month: 11, day: 7, hour: 11, minute: 48 },   // 입동
      { month: 12, day: 7, hour: 4, minute: 37 },   // 대설
      { month: 1, day: 6, hour: 10, minute: 1 },   // 소한
    ],
    2001: [
      { month: 2, day: 4, hour: 3, minute: 29 },   // 입춘
      { month: 3, day: 5, hour: 21, minute: 33 },   // 경칩
      { month: 4, day: 5, hour: 2, minute: 24 },   // 청명
      { month: 5, day: 5, hour: 19, minute: 45 },   // 입하
      { month: 6, day: 5, hour: 23, minute: 54 },   // 망종
      { month: 7, day: 7, hour: 10, minute: 7 },   // 소서
      { month: 8, day: 7, hour: 19, minute: 52 },   // 입추
      { month: 9, day: 7, hour: 22, minute: 46 },   // 백로
      { month: 10, day: 8, hour: 14, minute: 25 },   // 한로
      { month: 11, day: 7, hour: 17, minute: 37 },   // 입동
      { month: 12, day: 7, hour: 10, minute: 29 },   // 대설
      { month: 1, day: 5, hour: 15, minute: 49 },   // 소한
    ],
    2002: [
      { month: 2, day: 4, hour: 9, minute: 24 },   // 입춘
      { month: 3, day: 6, hour: 3, minute: 28 },   // 경칩
      { month: 4, day: 5, hour: 8, minute: 19 },   // 청명
      { month: 5, day: 6, hour: 1, minute: 38 },   // 입하
      { month: 6, day: 6, hour: 5, minute: 45 },   // 망종
      { month: 7, day: 7, hour: 15, minute: 57 },   // 소서
      { month: 8, day: 8, hour: 1, minute: 40 },   // 입추
      { month: 9, day: 8, hour: 4, minute: 31 },   // 백로
      { month: 10, day: 8, hour: 20, minute: 10 },   // 한로
      { month: 11, day: 7, hour: 23, minute: 22 },   // 입동
      { month: 12, day: 7, hour: 16, minute: 14 },   // 대설
      { month: 1, day: 5, hour: 21, minute: 43 },   // 소한
    ],
    2003: [
      { month: 2, day: 4, hour: 15, minute: 6 },   // 입춘
      { month: 3, day: 6, hour: 9, minute: 5 },   // 경칩
      { month: 4, day: 5, hour: 13, minute: 53 },   // 청명
      { month: 5, day: 6, hour: 7, minute: 11 },   // 입하
      { month: 6, day: 6, hour: 11, minute: 20 },   // 망종
      { month: 7, day: 7, hour: 21, minute: 36 },   // 소서
      { month: 8, day: 8, hour: 7, minute: 24 },   // 입추
      { month: 9, day: 8, hour: 10, minute: 20 },   // 백로
      { month: 10, day: 9, hour: 2, minute: 1 },   // 한로
      { month: 11, day: 8, hour: 5, minute: 13 },   // 입동
      { month: 12, day: 7, hour: 22, minute: 5 },   // 대설
      { month: 1, day: 6, hour: 3, minute: 28 },   // 소한
    ],
    2004: [
      { month: 2, day: 4, hour: 20, minute: 56 },   // 입춘
      { month: 3, day: 5, hour: 14, minute: 56 },   // 경칩
      { month: 4, day: 4, hour: 19, minute: 43 },   // 청명
      { month: 5, day: 5, hour: 13, minute: 3 },   // 입하
      { month: 6, day: 5, hour: 17, minute: 14 },   // 망종
      { month: 7, day: 7, hour: 3, minute: 31 },   // 소서
      { month: 8, day: 7, hour: 13, minute: 20 },   // 입추
      { month: 9, day: 7, hour: 16, minute: 13 },   // 백로
      { month: 10, day: 8, hour: 7, minute: 49 },   // 한로
      { month: 11, day: 7, hour: 10, minute: 59 },   // 입동
      { month: 12, day: 7, hour: 3, minute: 49 },   // 대설
      { month: 1, day: 6, hour: 9, minute: 18 },   // 소한
    ],
    2005: [
      { month: 2, day: 4, hour: 2, minute: 43 },   // 입춘
      { month: 3, day: 5, hour: 20, minute: 45 },   // 경칩
      { month: 4, day: 5, hour: 1, minute: 34 },   // 청명
      { month: 5, day: 5, hour: 18, minute: 53 },   // 입하
      { month: 6, day: 5, hour: 23, minute: 2 },   // 망종
      { month: 7, day: 7, hour: 9, minute: 16 },   // 소서
      { month: 8, day: 7, hour: 19, minute: 3 },   // 입추
      { month: 9, day: 7, hour: 21, minute: 56 },   // 백로
      { month: 10, day: 8, hour: 13, minute: 33 },   // 한로
      { month: 11, day: 7, hour: 16, minute: 43 },   // 입동
      { month: 12, day: 7, hour: 9, minute: 33 },   // 대설
      { month: 1, day: 5, hour: 15, minute: 3 },   // 소한
    ],
    2006: [
      { month: 2, day: 4, hour: 8, minute: 27 },   // 입춘
      { month: 3, day: 6, hour: 2, minute: 28 },   // 경칩
      { month: 4, day: 5, hour: 7, minute: 15 },   // 청명
      { month: 5, day: 6, hour: 0, minute: 30 },   // 입하
      { month: 6, day: 6, hour: 4, minute: 37 },   // 망종
      { month: 7, day: 7, hour: 14, minute: 51 },   // 소서
      { month: 8, day: 8, hour: 0, minute: 41 },   // 입추
      { month: 9, day: 8, hour: 3, minute: 39 },   // 백로
      { month: 10, day: 8, hour: 19, minute: 21 },   // 한로
      { month: 11, day: 7, hour: 22, minute: 35 },   // 입동
      { month: 12, day: 7, hour: 15, minute: 27 },   // 대설
      { month: 1, day: 5, hour: 20, minute: 47 },   // 소한
    ],
    2007: [
      { month: 2, day: 4, hour: 14, minute: 18 },   // 입춘
      { month: 3, day: 6, hour: 8, minute: 18 },   // 경칩
      { month: 4, day: 5, hour: 13, minute: 5 },   // 청명
      { month: 5, day: 6, hour: 6, minute: 20 },   // 입하
      { month: 6, day: 6, hour: 10, minute: 27 },   // 망종
      { month: 7, day: 7, hour: 20, minute: 42 },   // 소서
      { month: 8, day: 8, hour: 6, minute: 31 },   // 입추
      { month: 9, day: 8, hour: 9, minute: 29 },   // 백로
      { month: 10, day: 9, hour: 1, minute: 11 },   // 한로
      { month: 11, day: 8, hour: 4, minute: 24 },   // 입동
      { month: 12, day: 7, hour: 21, minute: 14 },   // 대설
      { month: 1, day: 6, hour: 2, minute: 40 },   // 소한
    ],
    2008: [
      { month: 2, day: 4, hour: 20, minute: 0 },   // 입춘
      { month: 3, day: 5, hour: 13, minute: 59 },   // 경칩
      { month: 4, day: 4, hour: 18, minute: 46 },   // 청명
      { month: 5, day: 5, hour: 12, minute: 3 },   // 입하
      { month: 6, day: 5, hour: 16, minute: 12 },   // 망종
      { month: 7, day: 7, hour: 2, minute: 27 },   // 소서
      { month: 8, day: 7, hour: 12, minute: 17 },   // 입추
      { month: 9, day: 7, hour: 15, minute: 14 },   // 백로
      { month: 10, day: 8, hour: 6, minute: 57 },   // 한로
      { month: 11, day: 7, hour: 10, minute: 11 },   // 입동
      { month: 12, day: 7, hour: 3, minute: 2 },   // 대설
      { month: 1, day: 6, hour: 8, minute: 24 },   // 소한
    ],
    2009: [
      { month: 2, day: 4, hour: 1, minute: 50 },   // 입춘
      { month: 3, day: 5, hour: 19, minute: 48 },   // 경칩
      { month: 4, day: 5, hour: 0, minute: 34 },   // 청명
      { month: 5, day: 5, hour: 17, minute: 51 },   // 입하
      { month: 6, day: 5, hour: 21, minute: 59 },   // 망종
      { month: 7, day: 7, hour: 8, minute: 14 },   // 소서
      { month: 8, day: 7, hour: 18, minute: 1 },   // 입추
      { month: 9, day: 7, hour: 20, minute: 58 },   // 백로
      { month: 10, day: 8, hour: 12, minute: 40 },   // 한로
      { month: 11, day: 7, hour: 15, minute: 56 },   // 입동
      { month: 12, day: 7, hour: 8, minute: 52 },   // 대설
      { month: 1, day: 5, hour: 14, minute: 14 },   // 소한
    ],
    2010: [
      { month: 2, day: 4, hour: 7, minute: 48 },   // 입춘
      { month: 3, day: 6, hour: 1, minute: 46 },   // 경칩
      { month: 4, day: 5, hour: 6, minute: 30 },   // 청명
      { month: 5, day: 5, hour: 23, minute: 44 },   // 입하
      { month: 6, day: 6, hour: 3, minute: 50 },   // 망종
      { month: 7, day: 7, hour: 14, minute: 3 },   // 소서
      { month: 8, day: 7, hour: 23, minute: 49 },   // 입추
      { month: 9, day: 8, hour: 2, minute: 45 },   // 백로
      { month: 10, day: 8, hour: 18, minute: 27 },   // 한로
      { month: 11, day: 7, hour: 21, minute: 43 },   // 입동
      { month: 12, day: 7, hour: 14, minute: 39 },   // 대설
      { month: 1, day: 5, hour: 20, minute: 9 },   // 소한
    ],
    2011: [
      { month: 2, day: 4, hour: 13, minute: 33 },   // 입춘
      { month: 3, day: 6, hour: 7, minute: 30 },   // 경칩
      { month: 4, day: 5, hour: 12, minute: 12 },   // 청명
      { month: 5, day: 6, hour: 5, minute: 23 },   // 입하
      { month: 6, day: 6, hour: 9, minute: 27 },   // 망종
      { month: 7, day: 7, hour: 19, minute: 42 },   // 소서
      { month: 8, day: 8, hour: 5, minute: 33 },   // 입추
      { month: 9, day: 8, hour: 8, minute: 34 },   // 백로
      { month: 10, day: 9, hour: 0, minute: 19 },   // 한로
      { month: 11, day: 8, hour: 3, minute: 35 },   // 입동
      { month: 12, day: 7, hour: 20, minute: 29 },   // 대설
      { month: 1, day: 6, hour: 1, minute: 55 },   // 소한
    ],
    2012: [
      { month: 2, day: 4, hour: 19, minute: 22 },   // 입춘
      { month: 3, day: 5, hour: 13, minute: 21 },   // 경칩
      { month: 4, day: 4, hour: 18, minute: 6 },   // 청명
      { month: 5, day: 5, hour: 11, minute: 20 },   // 입하
      { month: 6, day: 5, hour: 15, minute: 26 },   // 망종
      { month: 7, day: 7, hour: 1, minute: 41 },   // 소서
      { month: 8, day: 7, hour: 11, minute: 31 },   // 입추
      { month: 9, day: 7, hour: 14, minute: 29 },   // 백로
      { month: 10, day: 8, hour: 6, minute: 12 },   // 한로
      { month: 11, day: 7, hour: 9, minute: 26 },   // 입동
      { month: 12, day: 7, hour: 2, minute: 19 },   // 대설
      { month: 1, day: 6, hour: 7, minute: 44 },   // 소한
    ],
    2013: [
      { month: 2, day: 4, hour: 1, minute: 13 },   // 입춘
      { month: 3, day: 5, hour: 19, minute: 14 },   // 경칩
      { month: 4, day: 5, hour: 0, minute: 2 },   // 청명
      { month: 5, day: 5, hour: 17, minute: 18 },   // 입하
      { month: 6, day: 5, hour: 21, minute: 23 },   // 망종
      { month: 7, day: 7, hour: 7, minute: 34 },   // 소서
      { month: 8, day: 7, hour: 17, minute: 20 },   // 입추
      { month: 9, day: 7, hour: 20, minute: 16 },   // 백로
      { month: 10, day: 8, hour: 11, minute: 58 },   // 한로
      { month: 11, day: 7, hour: 15, minute: 14 },   // 입동
      { month: 12, day: 7, hour: 8, minute: 8 },   // 대설
      { month: 1, day: 5, hour: 13, minute: 34 },   // 소한
    ],
    2014: [
      { month: 2, day: 4, hour: 7, minute: 3 },   // 입춘
      { month: 3, day: 6, hour: 1, minute: 2 },   // 경칩
      { month: 4, day: 5, hour: 5, minute: 46 },   // 청명
      { month: 5, day: 5, hour: 22, minute: 59 },   // 입하
      { month: 6, day: 6, hour: 3, minute: 3 },   // 망종
      { month: 7, day: 7, hour: 13, minute: 15 },   // 소서
      { month: 8, day: 7, hour: 23, minute: 3 },   // 입추
      { month: 9, day: 8, hour: 2, minute: 2 },   // 백로
      { month: 10, day: 8, hour: 17, minute: 48 },   // 한로
      { month: 11, day: 7, hour: 21, minute: 7 },   // 입동
      { month: 12, day: 7, hour: 14, minute: 4 },   // 대설
      { month: 1, day: 5, hour: 19, minute: 24 },   // 소한
    ],
    2015: [
      { month: 2, day: 4, hour: 12, minute: 58 },   // 입춘
      { month: 3, day: 6, hour: 6, minute: 56 },   // 경칩
      { month: 4, day: 5, hour: 11, minute: 39 },   // 청명
      { month: 5, day: 6, hour: 4, minute: 53 },   // 입하
      { month: 6, day: 6, hour: 8, minute: 58 },   // 망종
      { month: 7, day: 7, hour: 19, minute: 12 },   // 소서
      { month: 8, day: 8, hour: 5, minute: 1 },   // 입추
      { month: 9, day: 8, hour: 7, minute: 59 },   // 백로
      { month: 10, day: 8, hour: 23, minute: 43 },   // 한로
      { month: 11, day: 8, hour: 2, minute: 59 },   // 입동
      { month: 12, day: 7, hour: 19, minute: 53 },   // 대설
      { month: 1, day: 6, hour: 1, minute: 20 },   // 소한
    ],
    2016: [
      { month: 2, day: 4, hour: 18, minute: 46 },   // 입춘
      { month: 3, day: 5, hour: 12, minute: 43 },   // 경칩
      { month: 4, day: 4, hour: 17, minute: 27 },   // 청명
      { month: 5, day: 5, hour: 10, minute: 42 },   // 입하
      { month: 6, day: 5, hour: 14, minute: 48 },   // 망종
      { month: 7, day: 7, hour: 1, minute: 4 },   // 소서
      { month: 8, day: 7, hour: 10, minute: 53 },   // 입추
      { month: 9, day: 7, hour: 13, minute: 51 },   // 백로
      { month: 10, day: 8, hour: 5, minute: 33 },   // 한로
      { month: 11, day: 7, hour: 8, minute: 48 },   // 입동
      { month: 12, day: 7, hour: 1, minute: 41 },   // 대설
      { month: 1, day: 6, hour: 7, minute: 8 },   // 소한
    ],
    2017: [
      { month: 2, day: 4, hour: 0, minute: 34 },   // 입춘
      { month: 3, day: 5, hour: 18, minute: 33 },   // 경칩
      { month: 4, day: 4, hour: 23, minute: 17 },   // 청명
      { month: 5, day: 5, hour: 16, minute: 31 },   // 입하
      { month: 6, day: 5, hour: 20, minute: 37 },   // 망종
      { month: 7, day: 7, hour: 6, minute: 51 },   // 소서
      { month: 8, day: 7, hour: 16, minute: 40 },   // 입추
      { month: 9, day: 7, hour: 19, minute: 38 },   // 백로
      { month: 10, day: 8, hour: 11, minute: 22 },   // 한로
      { month: 11, day: 7, hour: 14, minute: 38 },   // 입동
      { month: 12, day: 7, hour: 7, minute: 33 },   // 대설
      { month: 1, day: 5, hour: 12, minute: 56 },   // 소한
    ],
    2018: [
      { month: 2, day: 4, hour: 6, minute: 29 },   // 입춘
      { month: 3, day: 6, hour: 0, minute: 28 },   // 경칩
      { month: 4, day: 5, hour: 5, minute: 13 },   // 청명
      { month: 5, day: 5, hour: 22, minute: 25 },   // 입하
      { month: 6, day: 6, hour: 2, minute: 29 },   // 망종
      { month: 7, day: 7, hour: 12, minute: 42 },   // 소서
      { month: 8, day: 7, hour: 22, minute: 31 },   // 입추
      { month: 9, day: 8, hour: 1, minute: 30 },   // 백로
      { month: 10, day: 8, hour: 17, minute: 15 },   // 한로
      { month: 11, day: 7, hour: 20, minute: 31 },   // 입동
      { month: 12, day: 7, hour: 13, minute: 25 },   // 대설
      { month: 1, day: 5, hour: 18, minute: 49 },   // 소한
    ],
    2019: [
      { month: 2, day: 4, hour: 12, minute: 14 },   // 입춘
      { month: 3, day: 6, hour: 6, minute: 9 },   // 경칩
      { month: 4, day: 5, hour: 10, minute: 51 },   // 청명
      { month: 5, day: 6, hour: 4, minute: 2 },   // 입하
      { month: 6, day: 6, hour: 8, minute: 6 },   // 망종
      { month: 7, day: 7, hour: 18, minute: 20 },   // 소서
      { month: 8, day: 8, hour: 4, minute: 13 },   // 입추
      { month: 9, day: 8, hour: 7, minute: 17 },   // 백로
      { month: 10, day: 8, hour: 23, minute: 6 },   // 한로
      { month: 11, day: 8, hour: 2, minute: 24 },   // 입동
      { month: 12, day: 7, hour: 19, minute: 18 },   // 대설
      { month: 1, day: 6, hour: 0, minute: 39 },   // 소한
    ],
    2020: [
      { month: 2, day: 4, hour: 18, minute: 3 },   // 입춘
      { month: 3, day: 5, hour: 11, minute: 57 },   // 경칩
      { month: 4, day: 4, hour: 16, minute: 38 },   // 청명
      { month: 5, day: 5, hour: 9, minute: 52 },   // 입하
      { month: 6, day: 5, hour: 13, minute: 59 },   // 망종
      { month: 7, day: 7, hour: 0, minute: 15 },   // 소서
      { month: 8, day: 7, hour: 10, minute: 7 },   // 입추
      { month: 9, day: 7, hour: 13, minute: 8 },   // 백로
      { month: 10, day: 8, hour: 4, minute: 55 },   // 한로
      { month: 11, day: 7, hour: 8, minute: 14 },   // 입동
      { month: 12, day: 7, hour: 1, minute: 10 },   // 대설
      { month: 1, day: 6, hour: 6, minute: 30 },   // 소한
    ],
    2021: [
      { month: 2, day: 3, hour: 23, minute: 59 },   // 입춘
      { month: 3, day: 5, hour: 17, minute: 53 },   // 경칩
      { month: 4, day: 4, hour: 22, minute: 35 },   // 청명
      { month: 5, day: 5, hour: 15, minute: 47 },   // 입하
      { month: 6, day: 5, hour: 19, minute: 52 },   // 망종
      { month: 7, day: 7, hour: 6, minute: 5 },   // 소서
      { month: 8, day: 7, hour: 15, minute: 54 },   // 입추
      { month: 9, day: 7, hour: 18, minute: 53 },   // 백로
      { month: 10, day: 8, hour: 10, minute: 39 },   // 한로
      { month: 11, day: 7, hour: 13, minute: 59 },   // 입동
      { month: 12, day: 7, hour: 6, minute: 57 },   // 대설
      { month: 1, day: 5, hour: 12, minute: 24 },   // 소한
    ],
    2022: [
      { month: 2, day: 4, hour: 5, minute: 50 },   // 입춘
      { month: 3, day: 5, hour: 23, minute: 43 },   // 경칩
      { month: 4, day: 5, hour: 4, minute: 20 },   // 청명
      { month: 5, day: 5, hour: 21, minute: 26 },   // 입하
      { month: 6, day: 6, hour: 1, minute: 25 },   // 망종
      { month: 7, day: 7, hour: 11, minute: 38 },   // 소서
      { month: 8, day: 7, hour: 21, minute: 29 },   // 입추
      { month: 9, day: 8, hour: 0, minute: 32 },   // 백로
      { month: 10, day: 8, hour: 16, minute: 22 },   // 한로
      { month: 11, day: 7, hour: 19, minute: 45 },   // 입동
      { month: 12, day: 7, hour: 12, minute: 46 },   // 대설
      { month: 1, day: 5, hour: 18, minute: 14 },   // 소한
    ],
    2023: [
      { month: 2, day: 4, hour: 11, minute: 42 },   // 입춘
      { month: 3, day: 6, hour: 5, minute: 36 },   // 경칩
      { month: 4, day: 5, hour: 10, minute: 13 },   // 청명
      { month: 5, day: 6, hour: 3, minute: 19 },   // 입하
      { month: 6, day: 6, hour: 7, minute: 18 },   // 망종
      { month: 7, day: 7, hour: 17, minute: 31 },   // 소서
      { month: 8, day: 8, hour: 3, minute: 23 },   // 입추
      { month: 9, day: 8, hour: 6, minute: 27 },   // 백로
      { month: 10, day: 8, hour: 22, minute: 16 },   // 한로
      { month: 11, day: 8, hour: 1, minute: 35 },   // 입동
      { month: 12, day: 7, hour: 18, minute: 33 },   // 대설
      { month: 1, day: 6, hour: 0, minute: 4 },   // 소한
    ],
    2024: [
      { month: 2, day: 4, hour: 17, minute: 27 },   // 입춘
      { month: 3, day: 5, hour: 11, minute: 23 },   // 경칩
      { month: 4, day: 4, hour: 16, minute: 2 },   // 청명
      { month: 5, day: 5, hour: 9, minute: 10 },   // 입하
      { month: 6, day: 5, hour: 13, minute: 10 },   // 망종
      { month: 7, day: 6, hour: 23, minute: 20 },   // 소서
      { month: 8, day: 7, hour: 9, minute: 10 },   // 입추
      { month: 9, day: 7, hour: 12, minute: 12 },   // 백로
      { month: 10, day: 8, hour: 4, minute: 0 },   // 한로
      { month: 11, day: 7, hour: 7, minute: 20 },   // 입동
      { month: 12, day: 7, hour: 0, minute: 17 },   // 대설
      { month: 1, day: 6, hour: 5, minute: 49 },   // 소한
    ],
    2025: [
      { month: 2, day: 3, hour: 23, minute: 10 },   // 입춘
      { month: 3, day: 5, hour: 17, minute: 7 },   // 경칩
      { month: 4, day: 4, hour: 21, minute: 48 },   // 청명
      { month: 5, day: 5, hour: 14, minute: 57 },   // 입하
      { month: 6, day: 5, hour: 18, minute: 57 },   // 망종
      { month: 7, day: 7, hour: 5, minute: 5 },   // 소서
      { month: 8, day: 7, hour: 14, minute: 51 },   // 입추
      { month: 9, day: 7, hour: 17, minute: 52 },   // 백로
      { month: 10, day: 8, hour: 9, minute: 41 },   // 한로
      { month: 11, day: 7, hour: 13, minute: 4 },   // 입동
      { month: 12, day: 7, hour: 6, minute: 5 },   // 대설
      { month: 1, day: 5, hour: 11, minute: 32 },   // 소한
    ],
    2026: [
      { month: 2, day: 4, hour: 5, minute: 2 },   // 입춘
      { month: 3, day: 5, hour: 22, minute: 59 },   // 경칩
      { month: 4, day: 5, hour: 3, minute: 40 },   // 청명
      { month: 5, day: 5, hour: 20, minute: 49 },   // 입하
      { month: 6, day: 6, hour: 0, minute: 49 },   // 망종
      { month: 7, day: 7, hour: 10, minute: 57 },   // 소서
      { month: 8, day: 7, hour: 20, minute: 43 },   // 입추
      { month: 9, day: 7, hour: 23, minute: 42 },   // 백로
      { month: 10, day: 8, hour: 15, minute: 30 },   // 한로
      { month: 11, day: 7, hour: 18, minute: 52 },   // 입동
      { month: 12, day: 7, hour: 11, minute: 53 },   // 대설
      { month: 1, day: 5, hour: 17, minute: 23 },   // 소한
    ],
    2027: [
      { month: 2, day: 4, hour: 10, minute: 46 },   // 입춘
      { month: 3, day: 6, hour: 4, minute: 39 },   // 경칩
      { month: 4, day: 5, hour: 9, minute: 17 },   // 청명
      { month: 5, day: 6, hour: 2, minute: 25 },   // 입하
      { month: 6, day: 6, hour: 6, minute: 25 },   // 망종
      { month: 7, day: 7, hour: 16, minute: 37 },   // 소서
      { month: 8, day: 8, hour: 2, minute: 26 },   // 입추
      { month: 9, day: 8, hour: 5, minute: 28 },   // 백로
      { month: 10, day: 8, hour: 21, minute: 17 },   // 한로
      { month: 11, day: 8, hour: 0, minute: 39 },   // 입동
      { month: 12, day: 7, hour: 17, minute: 38 },   // 대설
      { month: 1, day: 5, hour: 23, minute: 10 },   // 소한
    ],
    2028: [
      { month: 2, day: 4, hour: 16, minute: 31 },   // 입춘
      { month: 3, day: 5, hour: 10, minute: 25 },   // 경칩
      { month: 4, day: 4, hour: 15, minute: 3 },   // 청명
      { month: 5, day: 5, hour: 8, minute: 12 },   // 입하
      { month: 6, day: 5, hour: 12, minute: 16 },   // 망종
      { month: 7, day: 6, hour: 22, minute: 30 },   // 소서
      { month: 8, day: 7, hour: 8, minute: 21 },   // 입추
      { month: 9, day: 7, hour: 11, minute: 22 },   // 백로
      { month: 10, day: 8, hour: 3, minute: 8 },   // 한로
      { month: 11, day: 7, hour: 6, minute: 27 },   // 입동
      { month: 12, day: 6, hour: 23, minute: 25 },   // 대설
      { month: 1, day: 6, hour: 4, minute: 55 },   // 소한
    ],
    2029: [
      { month: 2, day: 3, hour: 22, minute: 20 },   // 입춘
      { month: 3, day: 5, hour: 16, minute: 17 },   // 경칩
      { month: 4, day: 4, hour: 20, minute: 58 },   // 청명
      { month: 5, day: 5, hour: 14, minute: 8 },   // 입하
      { month: 6, day: 5, hour: 18, minute: 10 },   // 망종
      { month: 7, day: 7, hour: 4, minute: 22 },   // 소서
      { month: 8, day: 7, hour: 14, minute: 12 },   // 입추
      { month: 9, day: 7, hour: 17, minute: 12 },   // 백로
      { month: 10, day: 8, hour: 8, minute: 58 },   // 한로
      { month: 11, day: 7, hour: 12, minute: 17 },   // 입동
      { month: 12, day: 7, hour: 5, minute: 14 },   // 대설
      { month: 1, day: 5, hour: 10, minute: 42 },   // 소한
    ],
    2030: [
      { month: 2, day: 4, hour: 4, minute: 8 },   // 입춘
      { month: 3, day: 5, hour: 22, minute: 3 },   // 경칩
      { month: 4, day: 5, hour: 2, minute: 40 },   // 청명
      { month: 5, day: 5, hour: 19, minute: 46 },   // 입하
      { month: 6, day: 5, hour: 23, minute: 44 },   // 망종
      { month: 7, day: 7, hour: 9, minute: 55 },   // 소서
      { month: 8, day: 7, hour: 19, minute: 47 },   // 입추
      { month: 9, day: 7, hour: 22, minute: 53 },   // 백로
      { month: 10, day: 8, hour: 14, minute: 45 },   // 한로
      { month: 11, day: 7, hour: 18, minute: 8 },   // 입동
      { month: 12, day: 7, hour: 11, minute: 7 },   // 대설
      { month: 1, day: 5, hour: 16, minute: 30 },   // 소한
    ],
    2031: [
      { month: 2, day: 4, hour: 9, minute: 58 },   // 입춘
      { month: 3, day: 6, hour: 3, minute: 51 },   // 경칩
      { month: 4, day: 5, hour: 8, minute: 28 },   // 청명
      { month: 5, day: 6, hour: 1, minute: 35 },   // 입하
      { month: 6, day: 6, hour: 5, minute: 36 },   // 망종
      { month: 7, day: 7, hour: 15, minute: 49 },   // 소서
      { month: 8, day: 8, hour: 1, minute: 43 },   // 입추
      { month: 9, day: 8, hour: 4, minute: 50 },   // 백로
      { month: 10, day: 8, hour: 20, minute: 43 },   // 한로
      { month: 11, day: 8, hour: 0, minute: 6 },   // 입동
      { month: 12, day: 7, hour: 17, minute: 3 },   // 대설
      { month: 1, day: 5, hour: 22, minute: 23 },   // 소한
    ],
    2032: [
      { month: 2, day: 4, hour: 15, minute: 49 },   // 입춘
      { month: 3, day: 5, hour: 9, minute: 40 },   // 경칩
      { month: 4, day: 4, hour: 14, minute: 17 },   // 청명
      { month: 5, day: 5, hour: 7, minute: 26 },   // 입하
      { month: 6, day: 5, hour: 11, minute: 28 },   // 망종
      { month: 7, day: 6, hour: 21, minute: 41 },   // 소서
      { month: 8, day: 7, hour: 7, minute: 33 },   // 입추
      { month: 9, day: 7, hour: 10, minute: 38 },   // 백로
      { month: 10, day: 8, hour: 2, minute: 30 },   // 한로
      { month: 11, day: 7, hour: 5, minute: 54 },   // 입동
      { month: 12, day: 6, hour: 22, minute: 53 },   // 대설
      { month: 1, day: 6, hour: 4, minute: 16 },   // 소한
    ],
    2033: [
      { month: 2, day: 3, hour: 21, minute: 42 },   // 입춘
      { month: 3, day: 5, hour: 15, minute: 32 },   // 경칩
      { month: 4, day: 4, hour: 20, minute: 8 },   // 청명
      { month: 5, day: 5, hour: 13, minute: 13 },   // 입하
      { month: 6, day: 5, hour: 17, minute: 13 },   // 망종
      { month: 7, day: 7, hour: 3, minute: 25 },   // 소서
      { month: 8, day: 7, hour: 13, minute: 15 },   // 입추
      { month: 9, day: 7, hour: 16, minute: 20 },   // 백로
      { month: 10, day: 8, hour: 8, minute: 14 },   // 한로
      { month: 11, day: 7, hour: 11, minute: 41 },   // 입동
      { month: 12, day: 7, hour: 4, minute: 44 },   // 대설
      { month: 1, day: 5, hour: 10, minute: 8 },   // 소한
    ],
    2034: [
      { month: 2, day: 4, hour: 3, minute: 41 },   // 입춘
      { month: 3, day: 5, hour: 21, minute: 32 },   // 경칩
      { month: 4, day: 5, hour: 2, minute: 7 },   // 청명
      { month: 5, day: 5, hour: 19, minute: 9 },   // 입하
      { month: 6, day: 5, hour: 23, minute: 7 },   // 망종
      { month: 7, day: 7, hour: 9, minute: 18 },   // 소서
      { month: 8, day: 7, hour: 19, minute: 9 },   // 입추
      { month: 9, day: 7, hour: 22, minute: 14 },   // 백로
      { month: 10, day: 8, hour: 14, minute: 7 },   // 한로
      { month: 11, day: 7, hour: 17, minute: 33 },   // 입동
      { month: 12, day: 7, hour: 10, minute: 37 },   // 대설
      { month: 1, day: 5, hour: 16, minute: 4 },   // 소한
    ],
    2035: [
      { month: 2, day: 4, hour: 9, minute: 32 },   // 입춘
      { month: 3, day: 6, hour: 3, minute: 22 },   // 경칩
      { month: 4, day: 5, hour: 7, minute: 54 },   // 청명
      { month: 5, day: 6, hour: 0, minute: 55 },   // 입하
      { month: 6, day: 6, hour: 4, minute: 51 },   // 망종
      { month: 7, day: 7, hour: 15, minute: 1 },   // 소서
      { month: 8, day: 8, hour: 0, minute: 54 },   // 입추
      { month: 9, day: 8, hour: 4, minute: 3 },   // 백로
      { month: 10, day: 8, hour: 19, minute: 58 },   // 한로
      { month: 11, day: 7, hour: 23, minute: 24 },   // 입동
      { month: 12, day: 7, hour: 16, minute: 25 },   // 대설
      { month: 1, day: 5, hour: 21, minute: 56 },   // 소한
    ],
    2036: [
      { month: 2, day: 4, hour: 15, minute: 19 },   // 입춘
      { month: 3, day: 5, hour: 9, minute: 12 },   // 경칩
      { month: 4, day: 4, hour: 13, minute: 46 },   // 청명
      { month: 5, day: 5, hour: 6, minute: 49 },   // 입하
      { month: 6, day: 5, hour: 10, minute: 47 },   // 망종
      { month: 7, day: 6, hour: 20, minute: 57 },   // 소서
      { month: 8, day: 7, hour: 6, minute: 49 },   // 입추
      { month: 9, day: 7, hour: 9, minute: 55 },   // 백로
      { month: 10, day: 8, hour: 1, minute: 49 },   // 한로
      { month: 11, day: 7, hour: 5, minute: 15 },   // 입동
      { month: 12, day: 6, hour: 22, minute: 16 },   // 대설
      { month: 1, day: 6, hour: 3, minute: 43 },   // 소한
    ],
    2037: [
      { month: 2, day: 3, hour: 21, minute: 11 },   // 입춘
      { month: 3, day: 5, hour: 15, minute: 6 },   // 경칩
      { month: 4, day: 4, hour: 19, minute: 44 },   // 청명
      { month: 5, day: 5, hour: 12, minute: 49 },   // 입하
      { month: 6, day: 5, hour: 16, minute: 47 },   // 망종
      { month: 7, day: 7, hour: 2, minute: 55 },   // 소서
      { month: 8, day: 7, hour: 12, minute: 43 },   // 입추
      { month: 9, day: 7, hour: 15, minute: 45 },   // 백로
      { month: 10, day: 8, hour: 7, minute: 38 },   // 한로
      { month: 11, day: 7, hour: 11, minute: 4 },   // 입동
      { month: 12, day: 7, hour: 4, minute: 7 },   // 대설
      { month: 1, day: 5, hour: 9, minute: 34 },   // 소한
    ],
    2038: [
      { month: 2, day: 4, hour: 3, minute: 3 },   // 입춘
      { month: 3, day: 5, hour: 20, minute: 55 },   // 경칩
      { month: 4, day: 5, hour: 1, minute: 29 },   // 청명
      { month: 5, day: 5, hour: 18, minute: 31 },   // 입하
      { month: 6, day: 5, hour: 22, minute: 25 },   // 망종
      { month: 7, day: 7, hour: 8, minute: 32 },   // 소서
      { month: 8, day: 7, hour: 18, minute: 21 },   // 입추
      { month: 9, day: 7, hour: 21, minute: 26 },   // 백로
      { month: 10, day: 8, hour: 13, minute: 22 },   // 한로
      { month: 11, day: 7, hour: 16, minute: 51 },   // 입동
      { month: 12, day: 7, hour: 9, minute: 56 },   // 대설
      { month: 1, day: 5, hour: 15, minute: 26 },   // 소한
    ],
    2039: [
      { month: 2, day: 4, hour: 8, minute: 53 },   // 입춘
      { month: 3, day: 6, hour: 2, minute: 43 },   // 경칩
      { month: 4, day: 5, hour: 7, minute: 16 },   // 청명
      { month: 5, day: 6, hour: 0, minute: 18 },   // 입하
      { month: 6, day: 6, hour: 4, minute: 15 },   // 망종
      { month: 7, day: 7, hour: 14, minute: 26 },   // 소서
      { month: 8, day: 8, hour: 0, minute: 18 },   // 입추
      { month: 9, day: 8, hour: 3, minute: 23 },   // 백로
      { month: 10, day: 8, hour: 19, minute: 17 },   // 한로
      { month: 11, day: 7, hour: 22, minute: 43 },   // 입동
      { month: 12, day: 7, hour: 15, minute: 45 },   // 대설
      { month: 1, day: 5, hour: 21, minute: 16 },   // 소한
    ],
    2040: [
      { month: 2, day: 4, hour: 14, minute: 39 },   // 입춘
      { month: 3, day: 5, hour: 8, minute: 31 },   // 경칩
      { month: 4, day: 4, hour: 13, minute: 5 },   // 청명
      { month: 5, day: 5, hour: 6, minute: 9 },   // 입하
      { month: 6, day: 5, hour: 10, minute: 8 },   // 망종
      { month: 7, day: 6, hour: 20, minute: 19 },   // 소서
      { month: 8, day: 7, hour: 6, minute: 10 },   // 입추
      { month: 9, day: 7, hour: 9, minute: 14 },   // 백로
      { month: 10, day: 8, hour: 1, minute: 5 },   // 한로
      { month: 11, day: 7, hour: 4, minute: 29 },   // 입동
      { month: 12, day: 6, hour: 21, minute: 30 },   // 대설
      { month: 1, day: 6, hour: 3, minute: 3 },   // 소한
    ],
    2041: [
      { month: 2, day: 3, hour: 20, minute: 25 },   // 입춘
      { month: 3, day: 5, hour: 14, minute: 17 },   // 경칩
      { month: 4, day: 4, hour: 18, minute: 52 },   // 청명
      { month: 5, day: 5, hour: 11, minute: 54 },   // 입하
      { month: 6, day: 5, hour: 15, minute: 50 },   // 망종
      { month: 7, day: 7, hour: 1, minute: 58 },   // 소서
      { month: 8, day: 7, hour: 11, minute: 48 },   // 입추
      { month: 9, day: 7, hour: 14, minute: 53 },   // 백로
      { month: 10, day: 8, hour: 6, minute: 47 },   // 한로
      { month: 11, day: 7, hour: 10, minute: 13 },   // 입동
      { month: 12, day: 7, hour: 3, minute: 16 },   // 대설
      { month: 1, day: 5, hour: 8, minute: 48 },   // 소한
    ],
    2042: [
      { month: 2, day: 4, hour: 2, minute: 13 },   // 입춘
      { month: 3, day: 5, hour: 20, minute: 5 },   // 경칩
      { month: 4, day: 5, hour: 0, minute: 40 },   // 청명
      { month: 5, day: 5, hour: 17, minute: 43 },   // 입하
      { month: 6, day: 5, hour: 21, minute: 38 },   // 망종
      { month: 7, day: 7, hour: 7, minute: 47 },   // 소서
      { month: 8, day: 7, hour: 17, minute: 39 },   // 입추
      { month: 9, day: 7, hour: 20, minute: 46 },   // 백로
      { month: 10, day: 8, hour: 12, minute: 41 },   // 한로
      { month: 11, day: 7, hour: 16, minute: 7 },   // 입동
      { month: 12, day: 7, hour: 9, minute: 9 },   // 대설
      { month: 1, day: 5, hour: 14, minute: 35 },   // 소한
    ],
    2043: [
      { month: 2, day: 4, hour: 7, minute: 59 },   // 입춘
      { month: 3, day: 6, hour: 1, minute: 47 },   // 경칩
      { month: 4, day: 5, hour: 6, minute: 20 },   // 청명
      { month: 5, day: 5, hour: 23, minute: 22 },   // 입하
      { month: 6, day: 6, hour: 3, minute: 18 },   // 망종
      { month: 7, day: 7, hour: 13, minute: 27 },   // 소서
      { month: 8, day: 7, hour: 23, minute: 20 },   // 입추
      { month: 9, day: 8, hour: 2, minute: 30 },   // 백로
      { month: 10, day: 8, hour: 18, minute: 28 },   // 한로
      { month: 11, day: 7, hour: 21, minute: 56 },   // 입동
      { month: 12, day: 7, hour: 14, minute: 57 },   // 대설
      { month: 1, day: 5, hour: 20, minute: 25 },   // 소한
    ],
    2044: [
      { month: 2, day: 4, hour: 13, minute: 44 },   // 입춘
      { month: 3, day: 5, hour: 7, minute: 31 },   // 경칩
      { month: 4, day: 4, hour: 12, minute: 3 },   // 청명
      { month: 5, day: 5, hour: 5, minute: 5 },   // 입하
      { month: 6, day: 5, hour: 9, minute: 4 },   // 망종
      { month: 7, day: 6, hour: 19, minute: 16 },   // 소서
      { month: 8, day: 7, hour: 5, minute: 9 },   // 입추
      { month: 9, day: 7, hour: 8, minute: 16 },   // 백로
      { month: 10, day: 8, hour: 0, minute: 13 },   // 한로
      { month: 11, day: 7, hour: 3, minute: 42 },   // 입동
      { month: 12, day: 6, hour: 20, minute: 45 },   // 대설
      { month: 1, day: 6, hour: 2, minute: 12 },   // 소한
    ],
    2045: [
      { month: 2, day: 3, hour: 19, minute: 36 },   // 입춘
      { month: 3, day: 5, hour: 13, minute: 25 },   // 경칩
      { month: 4, day: 4, hour: 17, minute: 57 },   // 청명
      { month: 5, day: 5, hour: 10, minute: 59 },   // 입하
      { month: 6, day: 5, hour: 14, minute: 57 },   // 망종
      { month: 7, day: 7, hour: 1, minute: 8 },   // 소서
      { month: 8, day: 7, hour: 10, minute: 59 },   // 입추
      { month: 9, day: 7, hour: 14, minute: 5 },   // 백로
      { month: 10, day: 8, hour: 6, minute: 0 },   // 한로
      { month: 11, day: 7, hour: 9, minute: 30 },   // 입동
      { month: 12, day: 7, hour: 2, minute: 35 },   // 대설
      { month: 1, day: 5, hour: 8, minute: 3 },   // 소한
    ],
    2046: [
      { month: 2, day: 4, hour: 1, minute: 30 },   // 입춘
      { month: 3, day: 5, hour: 19, minute: 17 },   // 경칩
      { month: 4, day: 4, hour: 23, minute: 45 },   // 청명
      { month: 5, day: 5, hour: 16, minute: 40 },   // 입하
      { month: 6, day: 5, hour: 20, minute: 32 },   // 망종
      { month: 7, day: 7, hour: 6, minute: 41 },   // 소서
      { month: 8, day: 7, hour: 16, minute: 34 },   // 입추
      { month: 9, day: 7, hour: 19, minute: 43 },   // 백로
      { month: 10, day: 8, hour: 11, minute: 42 },   // 한로
      { month: 11, day: 7, hour: 15, minute: 14 },   // 입동
      { month: 12, day: 7, hour: 8, minute: 21 },   // 대설
      { month: 1, day: 5, hour: 13, minute: 55 },   // 소한
    ],
    2047: [
      { month: 2, day: 4, hour: 7, minute: 18 },   // 입춘
      { month: 3, day: 6, hour: 1, minute: 5 },   // 경칩
      { month: 4, day: 5, hour: 5, minute: 32 },   // 청명
      { month: 5, day: 5, hour: 22, minute: 28 },   // 입하
      { month: 6, day: 6, hour: 2, minute: 20 },   // 망종
      { month: 7, day: 7, hour: 12, minute: 30 },   // 소서
      { month: 8, day: 7, hour: 22, minute: 26 },   // 입추
      { month: 9, day: 8, hour: 1, minute: 38 },   // 백로
      { month: 10, day: 8, hour: 17, minute: 37 },   // 한로
      { month: 11, day: 7, hour: 21, minute: 7 },   // 입동
      { month: 12, day: 7, hour: 14, minute: 11 },   // 대설
      { month: 1, day: 5, hour: 19, minute: 42 },   // 소한
    ],
    2048: [
      { month: 2, day: 4, hour: 13, minute: 4 },   // 입춘
      { month: 3, day: 5, hour: 6, minute: 54 },   // 경칩
      { month: 4, day: 4, hour: 11, minute: 25 },   // 청명
      { month: 5, day: 5, hour: 4, minute: 24 },   // 입하
      { month: 6, day: 5, hour: 8, minute: 18 },   // 망종
      { month: 7, day: 6, hour: 18, minute: 27 },   // 소서
      { month: 8, day: 7, hour: 4, minute: 19 },   // 입추
      { month: 9, day: 7, hour: 7, minute: 28 },   // 백로
      { month: 10, day: 7, hour: 23, minute: 27 },   // 한로
      { month: 11, day: 7, hour: 2, minute: 56 },   // 입동
      { month: 12, day: 6, hour: 20, minute: 0 },   // 대설
      { month: 1, day: 6, hour: 1, minute: 29 },   // 소한
    ],
    2049: [
      { month: 2, day: 3, hour: 18, minute: 53 },   // 입춘
      { month: 3, day: 5, hour: 12, minute: 43 },   // 경칩
      { month: 4, day: 4, hour: 17, minute: 14 },   // 청명
      { month: 5, day: 5, hour: 10, minute: 13 },   // 입하
      { month: 6, day: 5, hour: 14, minute: 4 },   // 망종
      { month: 7, day: 7, hour: 0, minute: 8 },   // 소서
      { month: 8, day: 7, hour: 9, minute: 57 },   // 입추
      { month: 9, day: 7, hour: 13, minute: 5 },   // 백로
      { month: 10, day: 8, hour: 5, minute: 5 },   // 한로
      { month: 11, day: 7, hour: 8, minute: 38 },   // 입동
      { month: 12, day: 7, hour: 1, minute: 47 },   // 대설
      { month: 1, day: 5, hour: 7, minute: 18 },   // 소한
    ],
    2050: [
      { month: 2, day: 4, hour: 0, minute: 44 },   // 입춘
      { month: 3, day: 5, hour: 18, minute: 33 },   // 경칩
      { month: 4, day: 4, hour: 23, minute: 3 },   // 청명
      { month: 5, day: 5, hour: 16, minute: 2 },   // 입하
      { month: 6, day: 5, hour: 19, minute: 55 },   // 망종
      { month: 7, day: 7, hour: 6, minute: 2 },   // 소서
      { month: 8, day: 7, hour: 15, minute: 52 },   // 입추
      { month: 9, day: 7, hour: 19, minute: 1 },   // 백로
      { month: 10, day: 8, hour: 11, minute: 0 },   // 한로
      { month: 11, day: 7, hour: 14, minute: 33 },   // 입동
      { month: 12, day: 7, hour: 7, minute: 41 },   // 대설
      { month: 1, day: 5, hour: 13, minute: 8 },   // 소한
    ],
};

// 특정 년도의 12절기 날짜 가져오기
// 소한(11번)은 해당 양력년 1월에 위치
export function getSolarTermDates(year: number): SolarTermDate[] {
  if (preciseData[year]) {
    return preciseData[year];
  }
  // 범위 밖 연도는 근사 계산
  return Array.from({ length: 12 }, (_, i) => approximateSolarTermDate(year, i));
}

// 주어진 날짜가 어느 절기 구간에 속하는지 판단
// 반환: 월 지지 index (2=인, 3=묘, ..., 1=축)
export function getMonthBranchByDate(year: number, month: number, day: number, hour: number = 0, minute: number = 0): number {
  const terms = getSolarTermDates(year);
  const prevTerms = getSolarTermDates(year - 1);

  interface TermInfo {
    termIdx: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  }

  // 해당 년도의 절기를 시간순으로 정렬
  const orderedTerms: TermInfo[] = [];

  // 소한 (index 11) - 1월
  orderedTerms.push({ termIdx: 11, ...terms[11] });
  // 입춘(0) ~ 대설(10) - 2월~12월
  for (let i = 0; i <= 10; i++) {
    orderedTerms.push({ termIdx: i, ...terms[i] });
  }

  // 날짜 비교 함수
  const toMinutes = (m: number, d: number, h: number, min: number) =>
    ((m - 1) * 31 + d) * 1440 + h * 60 + min;

  const targetMinutes = toMinutes(month, day, hour, minute);

  // 뒤에서부터 비교하여 해당 날짜 이전의 가장 가까운 절기를 찾음
  for (let i = orderedTerms.length - 1; i >= 0; i--) {
    const t = orderedTerms[i];
    const termMinutes = toMinutes(t.month, t.day, t.hour, t.minute);
    if (targetMinutes >= termMinutes) {
      return SOLAR_TERM_MONTH_BRANCH[t.termIdx];
    }
  }

  // 소한 이전이면 전년 대설 기준 (축월 = 전년 12월)
  return 1; // 축월
}
