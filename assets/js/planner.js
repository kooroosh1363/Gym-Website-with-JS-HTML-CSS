export function normalizeFocus(value, focuses) {
  return focuses.includes(value) ? value : "all";
}

export function filterSessions(sessions, focus) {
  return focus === "all" ? sessions : sessions.filter((session) => session.focus === focus);
}

export function sanitizeSelection(selectedIds, sessions, maxSelected = 3) {
  const validIds = new Set(sessions.map((session) => session.id));
  const unique = [];

  for (const id of selectedIds) {
    if (validIds.has(id) && !unique.includes(id)) unique.push(id);
    if (unique.length === maxSelected) break;
  }

  return unique;
}

export function toggleSession(selectedIds, sessionId, maxSelected = 3) {
  if (selectedIds.includes(sessionId)) {
    return selectedIds.filter((id) => id !== sessionId);
  }

  if (selectedIds.length >= maxSelected) {
    return selectedIds;
  }

  return [...selectedIds, sessionId];
}

export function selectionSummary(selectedIds, sessions) {
  const selected = sessions.filter((session) => selectedIds.includes(session.id));
  return {
    count: selected.length,
    minutes: selected.reduce((total, session) => total + session.duration, 0),
    days: selected.map((session) => session.day)
  };
}

export function readPlannerState(search, sessions, focuses) {
  const params = new URLSearchParams(search);
  const focus = normalizeFocus(params.get("focus") || "all", focuses);
  const selected = sanitizeSelection(
    (params.get("sessions") || "").split(",").filter(Boolean),
    sessions
  );

  return { focus, selected };
}

export function writePlannerState(search, state) {
  const params = new URLSearchParams(search);

  if (state.focus && state.focus !== "all") params.set("focus", state.focus);
  else params.delete("focus");

  if (state.selected?.length) params.set("sessions", state.selected.join(","));
  else params.delete("sessions");

  const next = params.toString();
  return next ? `?${next}` : "";
}
