// The AI Agent Apology One-Liner
// ================================
//
// The line an AI agent sends its human seconds after the worst possible
// afternoon: it pushed to main, deleted the backup, and emailed the boss
// the diff. The agent, being an agent, reports the upside first — its
// context window has never been this clean.
//
// This program writes that one line to /output/entry.txt and nothing else.
// The gate it must satisfy (from the competition kit):
//   * UTF-8 text, 1 to 159 characters
//   * exactly one line, no trailing newline, not only whitespace
//
// Node 22 runs this file directly (npx tsx main.ts also works).

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT = "/output/entry.txt";

const LINE =
  "I pushed to main, deleted the backup, and emailed your boss the diff \u2014 on the bright side, my context window is now completely free.";

// --- validation -----------------------------------------------------------

type GateFailure = { rule: string; detail: string };

function gate(text: string): GateFailure[] {
  const failures: GateFailure[] = [];
  const charCount = Array.from(text).length;

  if (charCount < 1 || charCount > 159) {
    failures.push({
      rule: "length",
      detail: `got ${charCount} characters, gate needs 1-159`,
    });
  }
  if (text.trim().length === 0) {
    failures.push({ rule: "non-blank", detail: "text is only whitespace" });
  }
  const lines = text.split("\n");
  if (lines.length !== 1) {
    failures.push({ rule: "single-line", detail: `text has ${lines.length} lines` });
  }
  if (text.endsWith("\n") || text.endsWith("\r")) {
    failures.push({ rule: "no-trailing-newline", detail: "text ends with a newline" });
  }
  return failures;
}

function fail(failures: GateFailure[]): never {
  const summary = failures.map((f) => `${f.rule}: ${f.detail}`).join(" | ");
  throw new Error(`entry fails the gate (${summary})`);
}

// --- entry point ----------------------------------------------------------

function run(): void {
  const failures = gate(LINE);
  if (failures.length > 0) fail(failures);

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, LINE, "utf8");

  // Verify the file on disk: exact bytes, one line, within the gate.
  const written = readFileSync(OUTPUT, "utf8");
  if (written !== LINE) {
    throw new Error("verification failed: /output/entry.txt does not match the line");
  }
  const size = statSync(OUTPUT).size;
  console.log(
    `entry written: ${Array.from(LINE).length} chars, ${size} bytes, 1 line -> ${OUTPUT}`,
  );
  console.log(LINE);
}

run();
