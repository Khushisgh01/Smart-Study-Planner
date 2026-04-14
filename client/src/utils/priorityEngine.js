export function computePriority({ weightage = 5, pyqFreq = 'medium', difficulty = 'medium', confidence = 0.5 }) {
  const pyqMap  = { low: 1, medium: 1.5, high: 2 };
  const diffMap = { easy: 0.8, medium: 1.2, hard: 1.8 };
  return (weightage * pyqMap[pyqFreq] * diffMap[difficulty]) / confidence;
}

export function generateTaskColor(taskType) {
  const map = {
    Learn:   '#1a3fa3',
    Revise1: '#9b59b6',
    Revise2: '#7d3b9c',
    PYQ:     '#e8a020',
  };
  return map[taskType] || '#1a3fa3';
}

export function getBadgeStyle(badge) {
  const map = {
    'High Weight': { bg: 'rgba(26,63,163,0.12)',   color: '#1a3fa3' },
    'Urgent':      { bg: 'rgba(255,45,120,0.12)',  color: '#ff2d78' },
    'Weak':        { bg: 'rgba(232,160,32,0.12)',  color: '#c9820a' },
    'On Track':    { bg: 'rgba(0,201,177,0.12)',   color: '#00c9b1' },
  };
  return map[badge] || { bg: 'rgba(100,100,100,0.1)', color: '#888' };
}