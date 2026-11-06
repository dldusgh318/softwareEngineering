# CodeQL vulnerable fixtures

> **WARNING: INTENTIONALLY VULNERABLE CODE — NEVER DEPLOY OR EXECUTE.**

This directory contains deliberately unsafe JavaScript snippets for validating
CodeQL code-scanning pipelines. It contains no real credentials, tokens,
personal data, or production integrations.

## Isolation from production

- The fixture is outside the Next.js application root
  (`festival-app/frontend/src`) and the Spring Boot Maven source roots.
- No production module imports this fixture.
- The router is never attached to an application and no server calls
  `listen()`.
- Do not move, import, build, package, deploy, or execute this file.

The fixture must remain checked into Git and must not be added to `.gitignore`
so that CodeQL source extraction can include it.

## Intended CodeQL patterns

- Command injection through `child_process.exec()`
- Code injection through `eval()`
- Path traversal through `fs.readFile()`
- Reflected XSS through an Express response
- Weak cryptography through MD5
