const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

// Intentionally vulnerable CodeQL fixtures. This router is never imported by
// the application, attached to a server, deployed, or executed.
const fixtureRouter = express.Router();

fixtureRouter.get("/fixture/command", (request, response) => {
  childProcess.exec(request.query.command, (_error, stdout) => {
    response.type("text/plain").send(stdout);
  });
});

fixtureRouter.get("/fixture/eval", (request, response) => {
  const result = eval(request.query.expression);
  response.json({ result });
});

fixtureRouter.get("/fixture/file", (request, response) => {
  const requestedPath = path.join(
    "/tmp/codeql-fixture",
    request.query.fileName,
  );
  fs.readFile(requestedPath, "utf8", (_error, contents) => {
    response.type("text/plain").send(contents);
  });
});

fixtureRouter.get("/fixture/xss", (request, response) => {
  response.send(`<html><body><h1>${request.query.displayName}</h1></body></html>`);
});

fixtureRouter.get("/fixture/md5", (request, response) => {
  const digest = crypto
    .createHash("md5")
    .update(String(request.query.value))
    .digest("hex");
  response.type("text/plain").send(digest);
});

module.exports = { fixtureRouter };
