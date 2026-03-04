export const calculatePriority = (impact, urgency) => {
  if (!impact || !urgency) return "low"; // default

  if (impact === "low") {
    if (urgency === "low" || urgency === "medium") return "low";
    if (urgency === "high") return "medium";
  }

  if (impact === "medium") {
    if (urgency === "low") return "low";
    if (urgency === "medium") return "medium";
    if (urgency === "high") return "high";
  }

  if (impact === "high") {
    if (urgency === "low") return "medium";
    if (urgency === "medium") return "high";
    if (urgency === "high") return "critical";
  }

  return "low";
};
