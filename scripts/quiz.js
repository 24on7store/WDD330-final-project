// quiz.js
    const menuIcon = document.getElementById("menuIcon");
    const mobileNav = document.getElementById("mobileNav");
        menuIcon.addEventListener("click", () => {
        if (mobileNav.style.display === "flex") {
        mobileNav.style.display = "none";
        } else {
        mobileNav.style.display = "flex";
        }
        });

// import {
//   saveLocalAnswers,
//   loadLocalAnswers,
//   clearLocalStorage,
//   saveLocalResult,
//   sendToGoogleSheet
// } from "./storage.js";

// Load questions from questions.json
fetch("data/questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data.questions;
    console.log("Questions loaded:", questions.length);
  })
  .catch(err => console.error("Failed to load questions:", err));


// Menu toggle
var navLinks = document.getElementById("navLinks");
function showMenu(){ navLinks.style.right = "0"; }
function hideMenu(){ navLinks.style.right = "-200px"; }

// DOMContent loaded handlers (message form + read more)
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function () {
      alert("Thank You! Message sent successfully!");
    });
  }

  const readMoreBtn = document.querySelector(".hero-btn");
  const aboutInFooter = document.querySelector("footer .about-us");
  if (readMoreBtn && aboutInFooter) {
    readMoreBtn.addEventListener("click", function (event) {
      event.preventDefault();
      aboutInFooter.scrollIntoView({ behavior: "smooth" });
    });
  }
});

// QUESTIONS array (keep exactly as you had)
let questions = [];

// Quiz logic
let currentIndex = 0;
//let userAnswers = {};
let userAnswers = loadLocalAnswers();
const questionsPerPage = 100;
let currentPage = 0;

const startBtn = document.getElementById("start-btn");
const timerEl = document.getElementById("timer");
const form = document.getElementById("quiz-form");
const container = document.getElementById("questions-container");
const username = document.getElementById("username");
const email = document.getElementById("email");
const whatsapp = document.getElementById("whatsapp");
const pagination = document.getElementById("pagination");

if (container) {
  container.addEventListener("change", e =>{
    if (e.target.name && e.target.name.startsWith("q")) {
      userAnswers[e.target.name] = e.target.value;
//       userAnswers[e.target.name] = e.target.value;
// saveLocalAnswers(userAnswers);

    }
  });
}

function renderQuestions(index) {
  if (!container) return;
  container.innerHTML = "";

  const startIndex = currentPage * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
  for (let i = startIndex; i < endIndex; i++) {
    const q = questions[i];
    const div = document.createElement("div");
    div.innerHTML = `<p class="quiz-question">${i + 1}. ${q.q}</p>` +
      q.options.map(opt =>
        `<label><input type="radio" name="q${i}" value="${opt}" ${userAnswers[`q${i}`] === opt ? "checked" : ""}> ${opt}</label>`
      ).join("");
    container.appendChild(div);
  }

  // Pagination
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  if (pagination) {
    pagination.innerHTML = "";
    if (currentPage > 0) {
      const prevBtn = document.createElement("button");
      prevBtn.classList.add("prev-btn");
      prevBtn.textContent = "Previous";
      prevBtn.type = "button";
      prevBtn.onclick = () => { currentPage--; renderQuestions(currentPage); };
      pagination.appendChild(prevBtn);
    }
    if (currentPage < totalPages - 1) {
      const nextBtn = document.createElement("button");
      nextBtn.classList.add("next-btn");
      nextBtn.textContent = "Next";
      nextBtn.type = "button";
      nextBtn.onclick = () => { currentPage++; renderQuestions(currentPage); };
      pagination.appendChild(nextBtn);
    }
  }
}

// START button behavior — start timer from timer.js
startBtn && startBtn.addEventListener("click", () => {
  const name = username ? username.value.trim() : "";
  const emailVal = email ? email.value.trim() : "";
  const whatsappVal = whatsapp ? whatsapp.value.trim() : "";

  if (!name) { alert("Please enter your full name."); return; }
  if (!emailVal && !whatsappVal) { alert("Please enter EITHER an email address OR a WhatsApp number."); return; }

  if (startBtn) startBtn.style.display = "none";
  if (timerEl) timerEl.style.display = "block";
  if (form) form.style.display = "block";

  renderQuestions();

  // Use global startTimer(durationSeconds, onTick, onEnd, formSelector)
  // duration: 2*60*60 (2 hours). onTick updates timer element (optional).
  if (typeof window.startTimer === "function") {
    window.startTimer(2 * 60 * 60,
      (remaining) => {
        if (timerEl) timerEl.textContent = `⏰Time left: ${window.formatTime ? window.formatTime(remaining) : remaining}`;
      },
      () => { alert("Time is up! Submitting quiz."); form && form.submit(); },
      "#quiz-form"
    );
  } else {
    console.warn("startTimer is not defined. Make sure timer.js is loaded first.");
  }
});

// SUBMIT behavior — stop timer then process
form && form.addEventListener("submit", (e) => {
  e.preventDefault();

  // stop timer (global)
  if (typeof window.stopTimer === "function") window.stopTimer();

  const name = username ? username.value.trim() : "";
  const emailVal = email ? email.value.trim() : "";
  const whatsappVal = whatsapp ? whatsapp.value.trim() : "";

  if (!name) { alert("Name is required to submit the quiz."); return; }
  if (!emailVal && !whatsappVal) { alert("EITHER an email address OR a WhatsApp number is required to submit this quiz."); return; }

  // Check unanswered
  const unanswered = [];
  questions.forEach((q, i) => {
    const selected = form.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) unanswered.push(i);
  });

  if (unanswered.length > 0) {
    const confirmSubmit = confirm("You haven't finished yet. Are you sure you want to submit it?");
    if (!confirmSubmit) {
      const firstUnanswered = form.querySelector(`input[name="q${unanswered[0]}"]`);
      if (firstUnanswered) firstUnanswered.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }

  
  // Scoring
  let score = 0;
  questions.forEach((q, i) => {
    const selected = form.querySelector(`input[name="q${i}"]:checked`);
    if (selected && selected.value === q.a) score++;
  });

  // Level logic
  let level = "A1";
  if (score > 85) level = "C2";
  else if (score > 68) level = "C1";
  else if (score > 51) level = "B2";
  else if (score > 35) level = "B1";
  else if (score > 18) level = "A2";

  alert(`Test submitted successfully!\nYou scored ${score}/${questions.length}.\nYour level is ${level}.`);

  // Send to Google Sheets
  // const formData = new FormData();
  // formData.append("name", name);
  // formData.append("email", emailVal);
  // formData.append("whatsapp", whatsappVal);
  // formData.append("score", score);
  // formData.append("level", level);

  // console.log('sending:', {name, email, whatsapp, score, level});

  // //fetch("https://script.google.com/macros/s/AKfycbypUbhTh-7Q5fsQw7H-jI103BKo81pNuS-K_o87vxAOINe7k6ftf0V70RfkPG0QE7UDVg/exec", {
  // fetch("https://script.google.com/macros/s/AKfycbzmLHBNlzYF48rxZ35GhswWZXYCqH1x-yMrN8G8NGgxmnbcj_nr9NxqdmyqWXLxsS6y/exec", {
  //   method: "POST",
  //   body: formData
  // });
  sendToGoogleSheet(name, emailVal, whatsappVal, score, level);
saveLocalResult(score, level);
clearLocalStorage();

// Save results to localStorage
localStorage.setItem("quizResults", JSON.stringify({
  name,
  email: emailVal,
  whatsapp: whatsappVal,
  score,
  level,
  total: questions.length
}));

// Redirect to results page
window.location.href = "results.html";


  form.reset();
  currentPage = 0;
  //setTimeout(() => location.reload(), 1000);
});
