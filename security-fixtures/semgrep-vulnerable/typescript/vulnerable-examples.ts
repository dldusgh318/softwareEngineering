import { exec } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Request, Response } from "express";

// Intentionally vulnerable Semgrep fixtures. This module is never imported by
// the Next.js application and must never be built, deployed, or executed.

export function evalInjection(request: Request): unknown {
  const expression = String(request.query.expression);
  return eval(expression);
}

export function commandInjection(request: Request): void {
  const command = String(request.query.command);
  exec(command);
}

export function pathTraversal(request: Request): string {
  const fileName = String(request.query.fileName);
  return readFileSync(join("/tmp/semgrep-fixture", fileName), "utf8");
}

export function reflectedXss(request: Request, response: Response): void {
  const displayName = String(request.query.displayName);
  response.send(`<html><body><h1>${displayName}</h1></body></html>`);
}

export function weakCryptography(request: Request): string {
  const value = String(request.query.value);
  return createHash("md5").update(value).digest("hex");
}
