export const calculateSTI = (quizScore, attempts) => {
  // STI is now purely based on the Certification Score
  // However, we apply a small penalty for multiple attempts to encourage careful learning
  // Penalty: -2 points for every attempt beyond the first (capped at -20)
  
  const attemptPenalty = Math.min((attempts - 1) * 2, 20);
  const finalScore = Math.max(0, quizScore - attemptPenalty);

  return Math.round(finalScore);
};

export const getBadge = (score) => {
  if (score >= 90) return { label: "Safety Master", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" };
  if (score >= 70) return { label: "Certified", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
  if (score >= 50) return { label: "Apprentice", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
  return { label: "Unverified", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" };
};