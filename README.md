# MotionCRM

A frontend CRM dashboard prototype built with React, TypeScript, and GSAP.

The app is meant to feel closer to a real product than a static UI demo. It includes async list/detail flows, partial updates, loading and error states, and a motion system designed to support the experience instead of overpower it.

---

## Tech Stack

- React (with TypeScript)
- Vite
- Tailwind CSS
- GSAP
- jQuery (used in a small isolated legacy-style example)

---

## Features

- Responsive dashboard layout with sidebar and topbar
- Searchable and filterable client table
- Lazy-loaded client details in a side drawer
- Async status and notes updates without full-page reloads
- Loading, error, empty, and retry states
- Local state patching after updates instead of refetching everything
- Stable drawer behavior during rapid switching between clients
- GSAP motion split into page, shell, content, and feedback layers
- Routing with React Router
- Reusable component structure

---

## Latest Additions

Recent work on the client management flow includes:

- A mock service layer with artificial latency to simulate real API behavior
- Separate list summaries and on-demand detail loading
- Field-level async saves for status and notes
- Local UI patching after updates instead of full list reloads
- Cleanup of remount and stale-state issues in the drawer flow
- A more natural motion pass with lighter steady-state interactions

---

## Async Architecture

The client flow is structured to mirror a real async frontend:

- Client summaries are fetched separately from client details
- The drawer loads detail data only when a client is selected
- Status and notes are saved asynchronously through the mock service layer
- Successful saves patch only the affected local state
- Loading, error, and retry states are handled at the section level
- The UI avoids full refetches for small updates and tries to stay visually stable during transitions

It is still a frontend-only project, but the data flow is intentionally shaped to feel close to production patterns.

---

## Why I Built It

This project is part of my frontend portfolio. I used it to focus on a few things that matter in real product work:

- structuring React UI around async state instead of static mock screens
- building interactions that hold up under loading, saving, and failure states
- using animation as product polish rather than decoration
- showing that modern frontend code can still live alongside legacy patterns when needed

---

## Notes

The app currently uses mock data and does not connect to a real backend.

The emphasis is on frontend architecture, interaction quality, and motion design rather than backend integration.

---

## Next Steps

The next improvements I’d make are:

- Better handling for async race conditions during rapid interactions
- Optimistic updates with rollback for selected actions
- A real API or mock server layer instead of in-memory service simulation
- Improve accessibility and reduced-motion support

Lower priority ideas:

- Charts and analytics widgets
- More advanced CRM actions and client metadata

---

## Author

V. Manouhos
GitHub: https://github.com/vmanX8/motion-crm
