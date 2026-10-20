# React Router 8 Template

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎨 [Pico CSS](https://picocss.com/docs/classless) (classless) + CSS Modules · [Lucide](https://lucide.dev/guide/packages/lucide-react) icons
- 🗄️ [Drizzle ORM](https://orm.drizzle.team/docs/connect-node-sqlite) on Node's built-in SQLite ([`node:sqlite`](https://nodejs.org/api/sqlite.html)) · [Zod](https://zod.dev) for validation
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies and set up the SQLite database:

```bash
cp .env.example .env
pnpm install
pnpm db:migrate # push app/db/schema.ts to the database
pnpm db:seed    # optional: reset and fill the todos table
```

### Development

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:3000`.

## Examples

- `app/routes/todos.tsx`, `app/routes/todo.tsx`: add, edit and toggle todos with loaders, actions and Drizzle. Database access lives in `app/todos/todos.server.ts`, which React Router keeps out of the client bundle.

## Building for Production

Create a production build:

```bash
pnpm run build
```

## Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `pnpm run build`

```text
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── server.js
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

[Pico CSS](https://picocss.com/docs/classless)'s classless build styles plain HTML elements. Global overrides live in `app/app.css` (loaded after Pico), and per-page styles in CSS Modules such as `app/todos/todos.module.css`.

---

Built with ❤️ using React Router.
