# Shitledge Web

Frontend for **知屎 Shitledge** built with Vue 3 + Vite + Vue Router.

## Run locally

```bash
npm install
npm run dev
```

Default URL: `http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

## Environment

- `.env.development`: local API base URL (`http://localhost:8081`)
- `.env.production`: production API base URL (`https://api.shitledge.com`)

## Pages

- `/` Home
- `/articles` list with search, sort, pagination
- `/articles/:id` article detail
- `/submit` submit form
- `/about` mission page
- `*` 404 page
