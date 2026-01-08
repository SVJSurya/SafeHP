export const calculateSTI = (quizScore, streak, lastActiveDate) => {
  // Logic: 50% Quiz + 30% Streak + 20% Engagement
  const today = new Date();
  const lastActive = lastActiveDate ? lastActiveDate.toDate() : new Date();
  const diffTime = Math.abs(today - lastActive);
  const daysInactive = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

  const quizComponent = quizScore * 0.5;
  const streakComponent = Math.min(streak, 10) * 3; 
  const decay = daysInactive > 2 ? (daysInactive - 2) * 5 : 0;

  let total = quizComponent + streakComponent - decay;
  if (total < 20 && quizScore === 0) total = 20; // Base score

  return Math.min(100, Math.max(0, Math.round(total)));
};

export const getBadge = (score) => {
  if (score >= 90) return { label: "Guardian", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" };
  if (score >= 70) return { label: "Protector", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
  if (score >= 50) return { label: "Learner", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
  return { label: "Novice", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" };
};