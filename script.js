function matchCandidate() {
  const candidateSkills = document.getElementById("candidateSkills").value.split(",").map(s => s.trim().toLowerCase());
  const projectRequirements = document.getElementById("projectRequirements").value.split(",").map(s => s.trim().toLowerCase());

  let score = 0;
  let explanations = [];

  projectRequirements.forEach(req => {
    if (candidateSkills.includes(req)) {
      score += 10; // weighted scoring
      explanations.push(`✔ Candidate has required skill: ${req}`);
    } else {
      explanations.push(`✘ Missing skill: ${req}`);
    }
  });

  // fairness-aware adjustment (simple demo: normalize score by total requirements)
  let normalizedScore = (score / (projectRequirements.length * 10)) * 100;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
    <p><strong>Match Score:</strong> ${normalizedScore.toFixed(2)}%</p>
    <h3>Reasoning:</h3>
    <ul>${explanations.map(e => `<li>${e}</li>`).join("")}</ul>
  `;
}