document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("quizResults"));

  if (!data) {
    document.body.innerHTML = "<h2>No results found. Please take the test first.</h2>";
    return;
  }

  document.getElementById("r-name").textContent = data.name;
  document.getElementById("r-contact").textContent = data.email || data.whatsapp;
  document.getElementById("r-score").textContent = `${data.score}/${data.total}`;
  document.getElementById("r-level").textContent = data.level;

  // Clear results so they don't show again automatically
  localStorage.removeItem("quizResults");
});
