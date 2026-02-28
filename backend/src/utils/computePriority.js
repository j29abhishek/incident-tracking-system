const computePriority = (impact, urgency) => {
  const priorityMatrix = {
    low: { low: "low", medium: "low", high: "medium" },
    medium: { low: "low", medium: "medium", high: "high" },
    high: { low: "medium", medium: "high", high: "critical" },
  };

  // Validate inputs
  if (!priorityMatrix[impact] || !priorityMatrix[impact][urgency]) {
    throw new Error(`Invalid impact (${impact}) or urgency (${urgency})`);
  }

  return priorityMatrix[impact][urgency];
};

module.exports = computePriority;
