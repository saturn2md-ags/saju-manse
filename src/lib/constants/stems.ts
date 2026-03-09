import { Element, YinYang } from '@/types/saju';

// 천간 (Heavenly Stems) - 10개
export const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
export const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

// 천간별 오행
export const STEM_ELEMENTS: Element[] = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];

// 천간별 음양
export const STEM_YINYANG: YinYang[] = ['양', '음', '양', '음', '양', '음', '양', '음', '양', '음'];

// 천간 색상 (UI 표시용)
export const STEM_COLORS: Record<Element, string> = {
  '목': '#22C55E', // green
  '화': '#EF4444', // red
  '토': '#EAB308', // yellow
  '금': '#E2E8F0', // white/light gray
  '수': '#3B82F6', // blue
};

// 천간 배경색 (UI 카드용)
export const ELEMENT_BG_COLORS: Record<Element, string> = {
  '목': '#166534',
  '화': '#991B1B',
  '토': '#854D0E',
  '금': '#475569',
  '수': '#1E40AF',
};

// 천간 한자 읽기
export const STEM_READINGS = ['갑목', '을목', '병화', '정화', '무토', '기토', '경금', '신금', '임수', '계수'] as const;
