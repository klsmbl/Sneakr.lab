// Small helper to find elements safely.
const $ = (selector) => document.querySelector(selector);

const loginTab = $("#loginTab");
const signupTab = $("#signupTab");
const loginPanel = $("#loginPanel");
const signupPanel = $("#signupPanel");

const loginForm = $("#loginForm");
const signupForm = $("#signupForm");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Switch between Login and Sign Up with a smooth transition.
function showPanel(panelName) {
  const isLogin = panelName === "login";

  loginTab.classList.toggle("active", isLogin);
  signupTab.classList.toggle("active", !isLogin);

  loginTab.setAttribute("aria-selected", String(isLogin));
  signupTab.setAttribute("aria-selected", String(!isLogin));

  loginPanel.classList.toggle("active", isLogin);
  signupPanel.classList.toggle("active", !isLogin);

  loginPanel.hidden = !isLogin;
  signupPanel.hidden = isLogin;

  clearFormMessages(isLogin ? signupForm : loginForm);
}

function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.querySelector(`[data-for="${fieldId}"]`);

  if (!field || !errorEl) return;

  field.classList.add("invalid");
  errorEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.querySelector(`[data-for="${fieldId}"]`);

  if (!field || !errorEl) return;

  field.classList.remove("invalid");
  errorEl.textContent = "";
}

function clearFormMessages(form) {
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => clearError(input.id));
}

function validateLogin() {
  let valid = true;
  const email = loginForm.loginEmail.value.trim();
  const password = loginForm.loginPassword.value.trim();

  clearFormMessages(loginForm);

  if (!email) {
    setError("loginEmail", "Email is required.");
    valid = false;
  } else if (!emailPattern.test(email)) {
    setError("loginEmail", "Please enter a valid email address.");
    valid = false;
  }

  if (!password) {
    setError("loginPassword", "Password is required.");
    valid = false;
  }

  return valid;
}

function validateSignUp() {
  let valid = true;
  const fullName = signupForm.fullName.value.trim();
  const email = signupForm.signupEmail.value.trim();
  const password = signupForm.signupPassword.value;
  const confirmPassword = signupForm.confirmPassword.value;

  clearFormMessages(signupForm);

  if (!fullName) {
    setError("fullName", "Full name is required.");
    valid = false;
  }

  if (!email) {
    setError("signupEmail", "Email is required.");
    valid = false;
  } else if (!emailPattern.test(email)) {
    setError("signupEmail", "Please enter a valid email address.");
    valid = false;
  }

  if (!password) {
    setError("signupPassword", "Password is required.");
    valid = false;
  } else if (password.length < 8) {
    setError("signupPassword", "Password must be at least 8 characters.");
    valid = false;
  }

  if (!confirmPassword) {
    setError("confirmPassword", "Please confirm your password.");
    valid = false;
  } else if (confirmPassword !== password) {
    setError("confirmPassword", "Passwords do not match.");
    valid = false;
  }

  return valid;
}

// Toggle password visibility for all eye-icon buttons.
function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll(".icon-toggle");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  });
}

loginTab.addEventListener("click", () => showPanel("login"));
signupTab.addEventListener("click", () => showPanel("signup"));

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateLogin()) {
    alert("Login form looks good. Connect this to your backend API.");
  }
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateSignUp()) {
    alert("Sign up form looks good. Connect this to your backend API.");
  }
});

setupPasswordToggles();
