# Contributing

Thanks for your interest in contributing to `arjunkuttikkat.com`.

This is the codebase for a live, personal website. Contributions are welcome, but the project’s editorial direction, content, and product decisions are intentionally opinionated and centrally maintained.

## Ways to contribute

- Fix bugs or regressions
- Improve accessibility, performance, or DX
- Suggest small UX/content structure improvements (without changing voice)
- Add tests or strengthen validation

If you’re planning a larger change, open an issue first to discuss the approach.

## Development setup

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Environment variables

Copy the example file and set values:

```bash
cp .env.example .env.local
```

### Run locally

```bash
npm run dev
```

## Pull request guidelines

- Keep PRs focused and reasonably small.
- Match the existing code style and conventions.
- Add/adjust types and validation when introducing new data.
- Don’t commit secrets. Use `.env.example` for documenting required variables.
- Ensure these pass before requesting review:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

## Commit style

No strict convention required, but keep messages clear and descriptive (what + why).

