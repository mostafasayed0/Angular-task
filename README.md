# Car Rental System Frontend

Production-style Angular frontend for a car rental platform with admin and customer portals.

## Tech Stack

- Angular `20.x` (standalone components + lazy loaded routes)
- Reactive Forms
- Angular Router
- HTTP Interceptors
- Responsive SCSS UI (light/dark theme)

## Backend API

Base URL: `https://task.abudiyab-soft.com/api`

## Setup

```bash
npm install
ng serve
```

Open `http://localhost:4200`.

## Build

```bash
npm run build
```

## Implemented Routes

- Public: `/login`, `/register`
- Admin:
  - `/admin/users`
  - `/admin/cars`
  - `/admin/orders`
- Customer:
  - `/cars`
  - `/cars/:id`
  - `/orders`
  - `/orders/:id`
  - `/installments`

## Key Features

- Auth flow: login / register / logout
- Token-based API auth via interceptor (`Authorization: Bearer <token>`)
- Global error interceptor (handles `401` and redirects)
- Admin:
  - Users list + user details
  - Cars CRUD
  - Orders list/details + payment status update
- Customer:
  - Cars list/details
  - Order creation with auto-calculated days and total
  - Orders list/details
  - Installments list + pay installment action
- List pages include search + server-side pagination parameters
- Loading and empty states
- Inline form validation
- Dark mode toggle
- English/Arabic language toggle

## Project Structure

```text
src/
  app/
    core/
      guards/
      interceptors/
      models/
      services/
    features/
      auth/
      admin/
      customer/
    shared/
```

## Language Switch (English / Arabic)

- Use the language toggle button in the top bar.
- The app updates direction (`ltr/rtl`) and stores locale in `localStorage`.

## Dark Mode Toggle

- Use the dark mode toggle button in the top bar.
- Preference is saved in `localStorage`.

## Notes

- The API service layer is separated by domain (`AdminApiService`, `CustomerApiService`).
- Guards enforce authentication and role-based route access.
- The app is designed to be GitHub-ready and easy to extend with tests/state management.
