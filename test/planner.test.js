import test from "node:test";
import assert from "node:assert/strict";
import { focuses, sessions } from "../assets/js/sessions.js";
import { filterSessions, normalizeFocus, readPlannerState, sanitizeSelection, selectionSummary, toggleSession, writePlannerState } from "../assets/js/planner.js";

test("unknown focus normalizes to all",()=>assert.equal(normalizeFocus("x",focuses),"all"));
test("sessions filter by focus",()=>assert.deepEqual(filterSessions(sessions,"mobility").map(s=>s.id),["mobility-reset","weekend-flow"]));
test("selection removes invalid ids and caps at three",()=>assert.deepEqual(sanitizeSelection(["lower-strength","bad","upper-strength","engine-intervals","weekend-flow"],sessions),["lower-strength","upper-strength","engine-intervals"]));
test("toggle adds and removes a session",()=>{assert.deepEqual(toggleSession([], "lower-strength"),["lower-strength"]);assert.deepEqual(toggleSession(["lower-strength"],"lower-strength"),[])});
test("toggle respects max selection",()=>assert.deepEqual(toggleSession(["lower-strength","upper-strength","engine-intervals"],"weekend-flow"),["lower-strength","upper-strength","engine-intervals"]));
test("summary totals duration and days",()=>assert.deepEqual(selectionSummary(["lower-strength","mobility-reset"],sessions),{count:2,minutes:80,days:["Monday","Wednesday"]}));
test("URL state recovers safely",()=>assert.deepEqual(readPlannerState("?focus=bad&sessions=lower-strength,bad",sessions,focuses),{focus:"all",selected:["lower-strength"]}));
test("URL writer preserves unrelated params",()=>assert.equal(writePlannerState("?ref=portfolio",{focus:"strength",selected:["lower-strength"]}),"?ref=portfolio&focus=strength&sessions=lower-strength"));
