# MotionCRM

A frontend CRM dashboard prototype built with React, TypeScript, Tailwind CSS, GSAP, and a small isolated jQuery demo.

This project is not trying to be a full CRM. The goal is to make a frontend demo feel closer to a real product: async data flows, lazy-loaded details, editable client records, loading states, save feedback, and motion that supports the UI instead of fighting it.

---

## Tech Stack

- React (with TypeScript)
- Vite
- Tailwind CSS
- GSAP
- jQuery for one isolated legacy-style widget
- React Router

---

## What It Does

- Responsive dashboard layout with sidebar, topbar, and routed pages
- Searchable and filterable client table
- Async client summary loading with loading, error, empty, and retry states
- Lazy-loaded client details in a side drawer
- Editable contact details, status, and notes
- Email and phone validation in the client form
- Field-level saving states instead of freezing the whole drawer
- Local state patching after updates instead of refetching everything
- Stable drawer behavior when switching between clients
- Revenue Trend line chart on the dashboard
- Legacy jQuery Tag Manager demo on the settings page
- Short source comments for first-time readers exploring the code

---

## Client Flow

The client page is built around a simple mock service layer.

The table loads lightweight client summaries first. When a row is clicked, the drawer opens and loads the heavier client details separately. This keeps the list/detail split close to how a real app would usually work.

Saving is also handled in small pieces:

- status updates patch the drawer detail and the matching table row
- contact detail updates patch both the drawer and table summary
- notes updates only patch the drawer detail
- failed note saves keep the typed text so the user can retry
- failed status saves revert the selection back to the last saved value

The data is still local, but the shape is intentionally closer to a real async frontend.

---

## Motion

GSAP is used in a few focused places:

- page entrance reveals
- sidebar and topbar entrance motion
- table row reveal and save highlight
- drawer shell open/close animation
- light drawer content transitions for loading and loaded states
- save feedback animation
- SVG line draw animation for the revenue chart

The drawer animation is split on purpose. The shell opens and closes as one stable layer, while the content inside changes separately. That avoids the full drawer replaying every time details load or a field saves.

---

## Legacy jQuery Demo

The settings page includes a small legacy-style Tag Manager.

The user can:

- add tags
- remove tags
- click a tag to edit it
- save edited tag text
- keep added tags after refresh through localStorage

This part is intentionally handled with jQuery inside one isolated React component. React provides the container, jQuery manages the DOM inside it, and the rest of the app does not depend on that legacy code.

---

## Why I Built It

I built MotionCRM as a frontend portfolio project to practice product-style UI work, not just static screens.

The main things I wanted to show are:

- working with async state in React
- keeping list and detail data separate
- editing local form drafts before saving
- handling loading, saving, error, and retry states
- using GSAP for useful UI polish
- showing how a small jQuery widget can live inside a modern React app without leaking everywhere

---

## Notes

The app uses mock data and localStorage. There is no real backend yet.

The code is also lightly documented with short comments so someone newer to React, GSAP, jQuery, and local state can follow the main ideas without reading a large explanation first.

---

## Next Steps

The next improvements I would make are:

- Better async race-condition handling during very fast client switching
- Optimistic updates with rollback for selected actions
- A real API or mock server layer instead of in-memory/localStorage simulation
- More accessibility work, especially focus handling and reduced-motion support
- More realistic project data and dashboard metrics

---

## Author

V. Manouhos

GitHub: https://github.com/vmanX8/motion-crm
