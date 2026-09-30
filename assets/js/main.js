import { focuses, sessions } from "./sessions.js";
import {
  filterSessions,
  readPlannerState,
  sanitizeSelection,
  selectionSummary,
  toggleSession,
  writePlannerState
} from "./planner.js";

const STORAGE_KEY = "kinetic-plan-v1";
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const filtersRoot = document.querySelector("[data-filters]");
const grid = document.querySelector("[data-session-grid]");
const clearButton = document.querySelector("[data-clear]");
const summaryCount = document.querySelector("[data-summary-count]");
const summaryMinutes = document.querySelector("[data-summary-minutes]");
const summaryDays = document.querySelector("[data-summary-days]");

function readStoredSelection() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? sanitizeSelection(parsed, sessions) : [];
  } catch {
    return [];
  }
}

const urlState = readPlannerState(window.location.search, sessions, focuses);
let state = {
  focus: urlState.focus,
  selected: urlState.selected.length ? urlState.selected : readStoredSelection()
};

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selected));
  const nextSearch = writePlannerState(window.location.search, state);
  const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
  history.replaceState(null, "", nextUrl);
}

function renderFilters() {
  filtersRoot.innerHTML = focuses.map((focus) => `
    <button
      class="filter-button"
      type="button"
      data-focus="${focus}"
      aria-pressed="${state.focus === focus}"
    >${focus}</button>
  `).join("");
}

function renderSessions() {
  const visible = filterSessions(sessions, state.focus);

  grid.innerHTML = visible.map((session) => {
    const selected = state.selected.includes(session.id);
    return `
      <article class="session-card" data-selected="${selected}">
        <div class="session-card__meta">
          <span>${session.day}</span>
          <span>${session.time}</span>
        </div>
        <p class="session-card__focus">${session.focus}</p>
        <h3>${session.title}</h3>
        <p>${session.description}</p>
        <dl>
          <div><dt>Duration</dt><dd>${session.duration} min</dd></div>
          <div><dt>Intensity</dt><dd>${session.intensity}</dd></div>
        </dl>
        <button
          class="session-select"
          type="button"
          data-session-id="${session.id}"
          aria-pressed="${selected}"
        >${selected ? "Remove from plan" : "Add to plan"}</button>
      </article>
    `;
  }).join("");
}

function renderSummary() {
  const summary = selectionSummary(state.selected, sessions);
  summaryCount.textContent = summary.count;
  summaryMinutes.textContent = summary.minutes;
  summaryDays.textContent = summary.days.length
    ? `Training days: ${summary.days.join(", ")}.`
    : "No sessions selected yet.";
}

function render() {
  state.selected = sanitizeSelection(state.selected, sessions);
  renderFilters();
  renderSessions();
  renderSummary();
  persistState();
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  menuToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
  nav.dataset.open = String(!open);
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.dataset.open = "false";
  }
});

filtersRoot.addEventListener("click", (event) => {
  const button = event.target.closest("[data-focus]");
  if (!button) return;
  state.focus = button.dataset.focus;
  render();
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-session-id]");
  if (!button) return;

  const next = toggleSession(state.selected, button.dataset.sessionId);
  if (next === state.selected) return;

  state.selected = next;
  render();
});

clearButton.addEventListener("click", () => {
  state = { focus: "all", selected: [] };
  render();
});

render();
