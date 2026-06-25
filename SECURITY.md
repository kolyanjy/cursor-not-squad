# Security policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `master` | ✅ Yes |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, email **security@tonightpick.app** with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations

You will receive an acknowledgement within **48 hours** and a full response within **7 days**.

We will coordinate a fix and public disclosure date with you. We credit all responsible disclosures in our release notes.

## Scope

TonightPick MVP has **no authentication, no PII, and no payments**. Sessions are identified by opaque UUIDs in the URL. The main risks in scope are:

- XSS via unsanitised activity content rendered in the frontend
- CORS misconfiguration exposing the API to untrusted origins
- Denial-of-service via session / catalog endpoints

Out of scope: social engineering, physical attacks, issues in third-party dependencies already publicly disclosed.
