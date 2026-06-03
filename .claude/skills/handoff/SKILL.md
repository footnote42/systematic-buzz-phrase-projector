---
name: handoff
description: Wrap up a completed spec, commit and push, then write a PROMPT.md for the next session
compatibility: Requires spec-kit project structure with .specify/ directory
metadata:
  author: footnote42
---

# Handoff

Close out the current spec, commit and push everything, and generate a handoff prompt so the next session can pick up exactly where this one left off.

## Execution

Work through these steps in order. Do not skip any.

### 1. Identify completed spec

Read `.specify/feature.json` to get `feature_directory`. Derive the spec number and name from the directory path (e.g. `specs/002-display-themes` → spec `002`, name `display-themes`).

### 2. Update documentation

Read `specs/<feature>/tasks.md`. Confirm every task is marked `[x]`. If any remain `[ ]`, report them to the user and stop — a handoff with incomplete tasks is invalid.

Read `CLAUDE.md`. Update the `<!-- SPECKIT START -->` / `<!-- SPECKIT END -->` agent context block so it references the **next** spec's plan (if one exists) or clears the block if none does. Do not modify anything outside those markers.

### 3. Stage, commit, and push

Run `git status` to see what is unstaged.

Stage all changed files:

```bash
git add -A
```

Compose a conventional commit message:

- Subject: `chore: handoff spec <NNN>-<name> — <one-line summary of what was built>`
- Body: bullet list of the main things delivered (3–6 bullets, past tense, imperative style)
- Footer: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

Commit with that message, then push to `origin/<current-branch>`.

If on a feature branch, also offer to merge to `main` (ask the user before doing so).

### 4. Write PROMPT.md

Determine the next spec to work on. Check `specs/` for the next numbered directory that does **not** yet have a `tasks.md` (i.e. not yet planned) or has no directory at all.

Write `PROMPT.md` to the project root. Overwrite if it already exists. The file must contain everything a fresh Claude Code session needs to pick up the project without reading the chat history:

```markdown
# Handoff — <project name>

## What was just completed

Spec <NNN>: <name>

<2–3 sentence plain-English summary of what was built and why.>

Key files changed:
- `<path>` — <one-line description>
- `<path>` — <one-line description>
(list every file created or significantly modified)

## Current state

- Branch: `<branch>`
- All tests passing: <yes / no — state the count>
- Build: <passing / failing>
- Deployed: <yes / no / unknown>

## Next task

<If a next spec directory exists:>
Spec <NNN+1>: <name>

Run `/speckit-clarify` to begin clarification, then `/speckit-plan`, `/speckit-tasks`, and `/speckit-implement`.

Spec file: `specs/<NNN+1>-<name>/spec.md`

<If no next spec exists:>
No pending spec. The next step is to run `/speckit-specify <feature description>` to start a new feature.

## Project quick-reference

- Dev server: `npm run dev` (localhost:3000)
- Tests: `npm test -- --run`
- Build: `npm run build`
- Lint: `npm run lint`
- British English throughout (identifiers, prose, UI copy)
- Constitution: `.specify/memory/constitution.md`
```

Fill in all `<placeholders>` with real values derived from the current project state.

### 5. Summary report

Print a concise summary:

```
Handoff complete.

Spec:     <NNN>-<name>
Commit:   <short SHA> — <subject>
Pushed:   origin/<branch>
PROMPT.md: written to project root

Next:     <next spec or "no pending spec">
```

## Done When

- [ ] All tasks in active spec confirmed `[x]`
- [ ] CLAUDE.md agent context block updated
- [ ] Changes committed with conventional commit message and pushed
- [ ] PROMPT.md written to project root with complete next-session context
- [ ] Summary printed
