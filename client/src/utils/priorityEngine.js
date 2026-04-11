export function computePriority({ weightage = 5, pyqFreq = 'medium', difficulty = 'medium', confidence = 0.5 }) {
  const pyqMap = { low: 1, medium: 1.5, high: 2 };
  const diffMap = { easy: 0.8, medium: 1.2, hard: 1.8 };
  return (weightage * pyqMap[pyqFreq] * diffMap[difficulty]) / confidence;
}

export function generateTaskColor(taskType) {
  const map = { Learn: '#4f6ef7', Revise1: '#9b59b6', Revise2: '#8e44ad', PYQ: '#f39c12' };
  return map[taskType] || '#4f6ef7';
}

export function getBadgeStyle(badge) {
  const map = {
    'High Weight': { bg: 'rgba(79,110,247,0.15)', color: '#4f6ef7' },
    'Urgent':      { bg: 'rgba(255,45,120,0.15)', color: '#ff2d78' },
    'Weak':        { bg: 'rgba(255,183,0,0.15)',  color: '#d4960a' },
    'On Track':    { bg: 'rgba(0,201,177,0.15)',  color: '#00c9b1' },
  };
  return map[badge] || { bg: 'rgba(100,100,100,0.15)', color: '#888' };
}