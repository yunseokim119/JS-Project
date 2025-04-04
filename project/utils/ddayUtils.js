function calculateDday(deadline) {
    const today = new Date();
    const endDate = new Date(deadline);
  
    const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  
    if (diff === 0) {
      return 'D-0 오늘 마감';
    } else if (diff > 0) {
      return `D-${diff}`;
    } else {
      return '마감';
    }
  }
  
  module.exports = { calculateDday };