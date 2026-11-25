import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";

const ENTRY =
  "Here lies a man who kept saying 'five more minutes.' Sleep, work, life — the snooze button finally won.";
const OUT = "output/entry.txt";
const DIR = import.meta.dirname;

function runMain(outPath) {
  execFileSync(process.execPath, ["main.ts", outPath], {
    cwd: DIR,
    stdio: "pipe",
  });
  return readFileSync(`${DIR}/${outPath}`, "utf8");
}

test("entry is a single non-empty line of 1-150 characters", () => {
  assert.equal(ENTRY.length >= 1 && ENTRY.length <= 150, true);
  assert.equal(ENTRY.trim().length > 0, true);
  assert.equal(ENTRY.includes("\n"), false);
  assert.equal(ENTRY, ENTRY.trim());
});

test("entry reads like a tombstone epitaph with a twist", () => {
  assert.match(ENTRY, /Here lies/i);
  assert.match(ENTRY, /snooze button/i);
});

test("main.ts writes the exact entry deterministically", () => {
  if (existsSync(`${DIR}/output`)) {
    rmSync(`${DIR}/output`, { recursive: true, force: true });
  }
  mkdirSync(`${DIR}/output`, { recursive: true });
  const first = runMain(OUT);
  const second = runMain(OUT);
  assert.equal(first, ENTRY);
  assert.equal(second, ENTRY);
  assert.equal(first, second);
});
