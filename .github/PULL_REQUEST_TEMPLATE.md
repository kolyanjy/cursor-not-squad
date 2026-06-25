## Summary

<!-- What does this PR do? One or two sentences. -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor (no behaviour change)
- [ ] Docs / comments
- [ ] Chore (deps, config, CI)

## How to test

<!-- Steps to verify this works as intended. -->

1. 
2. 
3. 

## Checklist

- [ ] `npm run build` passes (typecheck + bundle)
- [ ] `npm run lint` is clean
- [ ] New API calls go through `src/api/client.ts` (no direct `fetch` in pages/components)
- [ ] Async state uses discriminated union (`loading | success | error`) handled exhaustively
- [ ] Touch targets ≥ 48px for any new UI elements
- [ ] Screenshots or recording attached (if UI changed)

## Screenshots

<!-- Drag and drop before/after screenshots here if this changes the UI. -->
