# Contributing to TonightPick

Thanks for taking the time to contribute! This document covers how to set up a local environment, the conventions we follow, and the pull request process.

---

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Getting started](#getting-started)
- [Development workflow](#development-workflow)
- [Conventions](#conventions)
- [Submitting a pull request](#submitting-a-pull-request)
- [Reporting bugs](#reporting-bugs)
- [Suggesting features](#suggesting-features)

---

## Code of conduct

Be respectful, constructive, and welcoming. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## Getting started

### Prerequisites

- Node.js 20+ and npm 10+
- Docker + Compose v2 (optional — only needed for full-stack work)

### Frontend-only setup (recommended for UI work)

```bash
git clone https://github.com/cursor-not-squad/tonightpick.git
cd tonightpick/frontend
npm install
npm run dev    # http://localhost:5173
```

Mock mode is on by default (`VITE_USE_MOCK=true`). No backend needed.

### Full-stack setup

```bash
make setup   # builds images, starts services, seeds database
```

See the [README](README.md) for service URLs and environment variables.

---

## Development workflow

1. **Fork** the repo and create a branch from `master`:
   ```bash
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/my-bug
   ```

2. **Make your changes.** Keep commits focused — one logical change per commit.

3. **Verify locally:**
   ```bash
   cd frontend
   npm run build   # must pass (typecheck + bundle)
   npm run lint    # must be clean
   ```

4. **Push** your branch and open a PR against `master`.

---

## Conventions

### Branch naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<short-description>` | `feat/results-screen` |
| Bug fix | `fix/<short-description>` | `fix/reroll-counter` |
| Docs | `docs/<short-description>` | `docs/api-reference` |
| Chore | `chore/<short-description>` | `chore/update-deps` |

### Commit messages

Use the imperative mood and keep the subject line under 72 characters:

```
feat: add ResultsPage with liked activity list
fix: disable Again button at 0 rerolls
docs: update API contract with reroll endpoint
```

### Code style

- **TypeScript strict mode** — no `any`, no type assertions without a comment.
- **Async state** modeled as a discriminated union handled exhaustively (`loading | success | error` with `never` default).
- **No direct `fetch` in pages** — all network calls go through `src/api/client.ts` or `src/api/mock.ts`.
- **Path alias** `@/` for all internal imports.
- **No comments** explaining *what* code does — only *why* when non-obvious.
- Run `npm run lint` before pushing; CI will reject lint failures.

### File structure

Follow the existing structure in `frontend/src/`:

```
pages/     ← data-fetching + navigation
components/← presentational only; no fetch calls
api/       ← client.ts + mock.ts (same signatures)
types/     ← shared TypeScript types
hooks/     ← reusable React hooks
```

---

## Submitting a pull request

1. Fill in the [PR template](.github/PULL_REQUEST_TEMPLATE.md) — summary, test steps, screenshots if UI changed.
2. Keep PRs focused. Large PRs are hard to review; prefer a series of smaller ones.
3. All CI checks must pass before merge.
4. At least one approving review required.

---

## Reporting bugs

Use the [bug report template](../../issues/new?template=bug_report.yml). Include:
- Steps to reproduce
- Expected vs actual behaviour
- Browser / OS / Node version
- Screenshot or recording if relevant

---

## Suggesting features

Use the [feature request template](../../issues/new?template=feature_request.yml). Describe:
- The problem you're trying to solve
- Your proposed solution
- Alternatives you've considered

---

## Questions?

Open a [discussion](../../discussions) or drop a note in an issue.
