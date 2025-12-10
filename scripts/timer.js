// timer.js
// Plain JS (no modules). Exposes startTimer() and stopTimer() on window.

(function () {
  // total seconds (2 hours)
  let time = 2 * 60 * 60;
  let intervalId = null;

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function updateDisplay() {
    const timerEl = document.getElementById("timer");
    if (!timerEl) return;
    timerEl.textContent = `⏰Time left: ${formatTime(time)}`;
  }

  function tickAndMaybeSubmit(formSelector) {
    updateDisplay();
    if (time <= 0) {
      stopTimer();
      // If a form selector was given, submit that form
      if (formSelector) {
        const f = document.querySelector(formSelector);
        if (f) f.submit();
      } else {
        // fallback: attempt to submit quiz-form
        const fallback = document.getElementById("quiz-form");
        if (fallback) fallback.submit();
      }
      return;
    }
    time--;
  }

  function startTimer(durationSeconds, onTick, onEnd, formSelector) {
    // allow override duration
    if (typeof durationSeconds === "number") {
      time = durationSeconds;
    }
    // clear any existing
    stopTimer();

    // immediate update
    tickAndMaybeSubmit(formSelector);
    intervalId = setInterval(() => {
      tickAndMaybeSubmit(formSelector);
      if (typeof onTick === "function") onTick(time);
      if (time <= 0 && typeof onEnd === "function") onEnd();
    }, 1000);

    return intervalId;
  }

  function stopTimer() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // expose functions globally
  window.startTimer = startTimer;
  window.stopTimer = stopTimer;
  window.formatTime = formatTime;
})();
