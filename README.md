#  Vehicle Registration & Management Platform

A production-grade Vehicle Registration and Management dashboard built with React. This application allows users to view, register, edit, and manage vehicles with a clean and responsive UI.

---



##  Features

-  Client-side authentication with protected routes
-  Public vehicle list accessible to all users
- Admin dashboard with vehicle stats and management
- Multi-step vehicle registration form with strict validation
- Detailed vehicle view with tabbed interface
-  Delete vehicle with confirmation modal
-  Data caching with TanStack Query
-  Responsive design with Tailwind CSS

---

##  Test Credentials

Use these credentials to log in and access protected features:

| Field    | Value            |
|----------|------------------|
| Email    | test@gmail.com   |
| Password | Password!234     |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework |
| React Router DOM | Page navigation and protected routes |
| TanStack Query | Data fetching and caching |
| Axios | HTTP requests to the API |
| React Hook Form | Form state management |
| Zod | Client-side form validation |
| Tailwind CSS | Styling and responsive design |
| React Hot Toast | Success and error notifications |

---

##  Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
\```bash
git clone https://github.com/CherlyIC/vehicle-registration-platform.git
\```

2. Navigate into the project folder
\```bash
cd vehicle-app
\```

3. Install dependencies
\```bash
npm install
\```

4. Start the development server
\```bash
npm run dev
\```

5. Open your browser and visit
\```
http://localhost:5173
\```



## State Management Approach

## Authentication
Authentication is managed globally using the **React Context API**. The `AuthContext` holds the user's session state (`isAuthenticated`, `user`) and exposes `login()` and `logout()` functions to all components via the `useAuth()` custom hook. Session persistence is handled through `localStorage` so users remain logged in after a page refresh.



##  API
this is the API documentation link: https://student-management-system-backend.up.railway.app/api-docs/#/Vehicle/post_api_vehicle_service_vehicle

