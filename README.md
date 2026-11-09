# PlanSocial

**PlanSocial** is a community event platform where neighbors discover local
volunteer drives, host their own events, and keep track of everything they have
joined.

- **Live site:** `<add-your-deployed-url-here>` <!-- e.g. https://plan-social.vercel.app -->
- **Local site:** http://localhost:3000
- **API:** [plan-social-server](https://github.com/AbdullahRedoan/plan-social-server) (Express 5 + MongoDB)

## Features

- **Browse upcoming events** — a public, API-backed grid of future events with
  thumbnail, title, category, location, date, and a link to full details.
- **Event details and joining** — every event has a public detail page; signing
  in lets a visitor join, and the participant list is stored in MongoDB.
- **Create events** — organizers publish a title, description, category,
  thumbnail URL, location, and a future date/time, with client and server
  validation on every field.
- **Manage events** — a private dashboard lists only the events you created,
  with inline editing and a confirmation step before deleting. The API rejects
  edits and deletes from anyone who is not the owner.
- **Joined events** — a private calendar of the events you signed up for, sorted
  by the day they happen.
- **Email and social sign-in** — Better Auth handles email/password registration
  and login plus Google and GitHub OAuth, and issues the JWTs the API verifies.
- **Profile editing** — signed-in users can update their display name and photo
  so organizers know who is joining.
- **Light and dark themes** — one toggle in the header themes the entire app and
  remembers your choice across reloads.
- **Friendly feedback** — every success and failure surfaces as a toast instead
  of a browser `alert()`, and each route has loading skeletons and empty states.

## Tech stack

- Next.js 16 App Router (Cache Components, React Compiler, Turbopack)
- TypeScript, Tailwind CSS v4, shadcn/ui on Base UI, `lucide-react` icons
- Better Auth with the MongoDB adapter and the JWT plugin
- `next-themes` for theming and `sonner` for toasts
- Express 5 + MongoDB API in the sibling `server` repository

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Start the API repo first (default
`http://localhost:5000`), otherwise event lists render their empty states.

### Environment variables

`.env.example` documents the full list. All values are read at build/run time
and only `NEXT_PUBLIC_*` ones reach the browser, so secrets belong here and
never in a component.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API |
| `BETTER_AUTH_SECRET` | Secret used to sign sessions and JWTs |
| `BETTER_AUTH_URL` | Public origin of this app, e.g. `http://localhost:3000` |
| `MONGODB_URI` | MongoDB Atlas connection string used by Better Auth |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth app credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials |

`BETTER_AUTH_URL` must match the API's `CLIENT_URL` exactly (no trailing slash),
because the server verifies JWTs against `${CLIENT_URL}/api/auth/jwks`.

OAuth callback URLs:

- Google: `${BETTER_AUTH_URL}/api/auth/callback/google`
- GitHub: `${BETTER_AUTH_URL}/api/auth/callback/github`

## Scripts

```bash
npm run dev     # Turbopack dev server on http://localhost:3000
npm run lint    # eslint (there is no `next lint` in Next 16)
npx tsc --noEmit  # typecheck
npm run build   # production build
npm start       # serve the production build
```

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Banner, features, six recent events, gallery, newsletter |
| `/events` | Public | All upcoming events with search and category filters |
| `/events/[id]` | Public | Event details, join action, organizer contact |
| `/login`, `/register` | Public | Email/password and Google/GitHub authentication |
| `/create-event` | Private | Publish a new event |
| `/manage-events` | Private | Edit or delete the events you created |
| `/joined-events` | Private | Events you joined, sorted by event date |
| `/profile` | Private | Update your display name and photo |

Private routes are guarded twice: `src/proxy.ts` redirects unauthenticated
visitors before render, and each page calls `requireSession()` on the server.
Signed-in users are never bounced back to the login page on reload.

## Project structure

```
src/
├── app/            routes, auth handler, layout, global styles
├── components/     header, footer, event cards, forms, dialogs, providers
├── lib/            auth config, session helpers, API client, form validation
└── proxy.ts        optimistic route protection
```

All API calls go through `src/lib/api.ts`. Components never call `fetch`
directly, and the server never trusts identity fields from the request body —
it reads them from the verified JWT.

## Deploying

1. Deploy the API first and note its URL.
2. Deploy this repo to Vercel and set every variable from the table above, with
   `BETTER_AUTH_URL` set to the Vercel origin and `NEXT_PUBLIC_API_URL` set to
   the API URL.
3. Update the API's `CLIENT_URL` to the same Vercel origin.
4. Add the production OAuth callback URLs in Google and GitHub.
