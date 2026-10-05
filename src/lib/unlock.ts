import type { DayContent, StudentProgress, TestSection } from '@/types';
import { secKey } from '@/store/progress';

export function isUnlocked(day: DayContent, section: TestSection, student: StudentProgress, unlockAll: boolean) {
  if (unlockAll || !section.requires) return true;
  return !!student.sections[secKey(day.dayId, section.requires)]?.passed;
}

export function requiredSection(day: DayContent, section: TestSection) {
  return day.sections.find((s) => s.id === section.requires);
}
