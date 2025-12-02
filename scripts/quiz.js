// quiz.js
document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.getElementById("quiz-container");

    if (!quizContainer) return; // Not on quiz page

    console.log("Quiz page loaded");

    // Week 5: basic structure only
    quizContainer.innerHTML = `
        <h2>Quiz will load here</h2>
    `;
});
