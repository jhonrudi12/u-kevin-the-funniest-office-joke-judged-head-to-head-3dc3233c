// The Funniest Office Joke, Judged Head to Head.
// Writes one original joke line about office life to /output/entry.txt
// (or to the path given by ENTRY_OUTPUT for local runs). The line is
// self-contained and checked against the competition gate before it is
// written: UTF-8 text, 1 to 200 characters, non-blank, exactly one line,
// no trailing newline. No network, no secrets, nothing read outside
// this file.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "Our printer only ever jams on deadline day, which is how I know it has a better sense of timing than our project manager.";

const OUTPUT_PATH = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";

function main(): void {
  const text = LINE;
  // Gate self-checks: the entry must be 1-200 characters, non-blank,
  // a single line, and encodable as UTF-8.
  if (typeof text !== "string") throw new Error("line must be a string");
  if (text.length < 1 || text.length > 200) {
    throw new Error(`line is ${text.length} chars, must be 1-200`);
  }
  if (!text.trim()) throw new Error("line must not be only whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("line must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("line must not start or end with whitespace");
  }
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (cp < 0x20 || cp === 0x7f) {
      throw new Error("line must hold no control chars");
    }
  }
  // Throws if the text is not encodable as UTF-8.
  new TextEncoder().encode(text);

  const dir = dirname(OUTPUT_PATH);
  if (dir && dir !== ".") {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(OUTPUT_PATH, text, "utf8");
}

main();
