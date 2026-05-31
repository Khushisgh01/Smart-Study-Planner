/** Parse exam dates consistently (date-only strings stay in local time). */
export function parseExamDate(examDate) {
  if (!examDate) return null;
  if (typeof examDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(examDate)) {
    const [y, m, d] = examDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const parsed = new Date(examDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDaysUntilExam(examDate) {
  const exam = parseExamDate(examDate);
  if (!exam) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  return Math.ceil((exam - today) / 86400000);
}

export function formatExamCountdown(examDate) {
  const days = getDaysUntilExam(examDate);
  if (days === null) return 'Exam date not set';
  if (days < 0) return 'Exam passed';
  if (days === 0) return 'Exam today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export function formatExamDateShort(examDate) {
  const exam = parseExamDate(examDate);
  if (!exam) return '—';
  return exam.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function isSameCalendarDay(a, b) {
  const d1 = parseExamDate(a);
  const d2 = parseExamDate(b);
  if (!d1 || !d2) return false;
  return d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate();
}
