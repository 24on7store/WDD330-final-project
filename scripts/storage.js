
// Save answers locally
window.saveLocalAnswers = function (answers) {
  localStorage.setItem("userAnswers", JSON.stringify(answers));
};

// Load saved answers
window.loadLocalAnswers = function () {
  const saved = localStorage.getItem("userAnswers");
  return saved ? JSON.parse(saved) : {};
};

// Clear saved answers
window.clearLocalStorage = function () {
  localStorage.removeItem("userAnswers");
};

// Save result locally
window.saveLocalResult = function (score, level) {
  localStorage.setItem("quizResult", JSON.stringify({ score, level }));
};

// Send to Google Sheets
window.sendToGoogleSheet = function (name, email, whatsapp, score, level) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("whatsapp", whatsapp);
  formData.append("score", score);
  formData.append("level", level);

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbzmLHBNlzYF48rxZ35GhswWZXYCqH1x-yMrN8G8NGgxmnbcj_nr9NxqdmyqWXLxsS6y/exec";

  return fetch(scriptURL, {
    method: "POST",
    body: formData
  })
    .then(() => console.log("Data sent to Google Sheet"))
    .catch((err) => console.error("Failed to send data:", err));
};
