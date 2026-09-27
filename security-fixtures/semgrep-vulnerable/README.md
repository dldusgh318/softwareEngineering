# Semgrep vulnerable fixtures

> **WARNING: INTENTIONALLY VULNERABLE CODE — NEVER DEPLOY OR EXECUTE.**

This directory exists only to verify that the Semgrep pipeline reports known
vulnerability patterns. The examples use placeholder input and do not contain
real credentials, tokens, personal data, or production integrations.

## Isolation from production

- This directory is outside the Spring Boot Maven source roots
  (`festival-app/backend/src/main`) and the Next.js application root
  (`festival-app/frontend/src`).
- Nothing in the backend or frontend imports these files.
- The Java class has no Spring component/controller annotation, and the
  TypeScript module does not create or register a router.
- Do not move, import, compile, package, deploy, or execute these files.

The fixture files must remain checked into Git and must not be added to
`.gitignore`, because the repository's Semgrep commands scan Git-tracked files.

## Verification commands

Run from the repository root:

```sh
semgrep \
  --config p/default \
  --metrics=off \
  --verbose \
  .

semgrep \
  --config p/owasp-top-ten \
  --config p/java \
  --config p/typescript \
  --metrics=off \
  --verbose \
  .
```
