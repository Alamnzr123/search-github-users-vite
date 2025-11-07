# GitHub User Search (Vite + React)

> A small Vite + React app to search GitHub users and view their repositories. This project using layered architecture (UI, service, domain types) and includes caching, tests, and a Dockerfile for production deployment.

![screenshot](./public/screenshot.png)

## Features

- Search GitHub users (GitHub Search API)
- View repositories for a selected user
- Avatars and profile links
- In-memory caching with TTL for users and repos
- Flowbite UI components for simple notifications
- Unit tests using Vitest
- Dockerfile + nginx config for production builds

## Quick start

Prerequisites:

- Node.js 18+ and npm
- (Optional) Docker to build the production image

Install dependencies:

```bash
npm install
```

Run the app in development:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

## Docker

Build the Docker image (from project root):

```powershell
docker build -t github-user-search:latest .
```

Run:

```powershell
docker run --rm -p 5173:80 github-user-search:latest
```

Open http://localhost:5173

Notes:

- The Dockerfile is a multi-stage build: it runs `npm run build` and serves the `dist/` output with nginx using the included `nginx.conf`.

## Tests

Unit tests are written with Vitest and located under `src/services/__tests__`.

To run tests:

```bash
npm run test
```

## Project structure (high level)

- `src/` — React source code
  - `services/` — API/service layer (caching + API calls)
  - `types/` — domain types
  - `components/` — small presentational components (Header, Footer, Notification)
- `public/` — static assets (screenshot preserved)
- `Dockerfile`, `nginx.conf` — production image config

## Development notes

- Caching is in-memory and uses a default TTL of 2 minutes. It is suitable for simple client-side performance improvements.
- Notification currently uses Flowbite's Alert component — it can be extended into a queued toast system with auto-dismiss.

If you'd like, I can:

- Add auto-dismiss and stacking for notifications.
- Add CI (GitHub Actions) to build images and run tests.
- Improve UI/UX (card layout, pagination, repo sorting).

## License

This project is released under the MIT License - see the [LICENSE](./LICENSE) file for details.

![MIT](https://img.shields.io/badge/license-MIT-green.svg)
