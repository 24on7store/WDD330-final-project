// storage.js

export function saveResult(resultObj) {
    localStorage.setItem("quizResult", JSON.stringify(resultObj));
}

export function loadResult() {
    return JSON.parse(localStorage.getItem("quizResult"));
}
