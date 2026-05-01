# Bifrost 🌉

A modern, minimal starter for a React + Vite frontend paired with an Express + MongoDB backend — focused on authentication, email utilities, and social sign-on.

**Scope:** This repository focuses exclusively on authentication (login, signup, social sign-on, password reset) and related utilities — it does not implement a full product or unrelated business logic.

Key goals:
- Elegant developer experience with Vite HMR ⚡
- Secure, JWT-based auth on the server 🔐
- Email utilities for verification and password reset ✉️
- Social sign-on (Google, GitHub) ready to configure 🤝

**Repository layout**
- [client](client): React + Vite application (UI, routes, components).
- [server](server): Express API, auth controllers, database connection, and utilities.

**Core tech**: React, Vite, Express, MongoDB, Mongoose, JWT, Nodemailer.

--

**Quick Start**

1. Install dependencies for both projects:

```bash
# from repository root
cd client && npm install
cd ../server && npm install
```

2. Create environment variables (see below) and run both apps in development:

```bash
# Start the client (Vite)
cd client
npm run dev

# Start the server (nodemon recommended)
cd ../server
npm run dev
```

Open the client at http://localhost:5173 and the API at http://localhost:5000 by default.

--

**Environment variables**

Create a `.env` file in the `server` folder (example: [server/.env](server/.env)). The server expects the following variables:

- **MONGO_URI**: MongoDB connection string (required).
- **PORT**: Server port (default: `5000`).
- **JWT_SECRET**: Strong secret used to sign JWTs (required).
- **GOOGLE_CLIENT_ID**: OAuth client ID for Google sign-in (used for token verification).
- **CLIENT_URL**: Frontend origin(s) for CORS (e.g. `http://localhost:5173`).
- **EMAIL_USER**: Email address used to send messages (Nodemailer 'from').
- **EMAIL_PASSWORD**: App password or SMTP password for `EMAIL_USER`.

Notes:
- Never commit real credentials to version control. Use environment secrets or CI/CD secret storage for production.
- If you prefer different names for client origin variables, the server will also check `CLIENT_ORIGIN` and `FRONTEND_URL`.

--

**Project scripts**
- Client: `npm run dev` (Vite), `npm run build` (production), `npm run preview` (serve build).
- Server: `npm run dev` (nodemon), `npm start` (node server.js).

--

**Production & Deployment**

- Use environment-specific configuration in your hosting platform (Vercel, Heroku, DigitalOcean, etc.).
- Ensure `MONGO_URI` points to a production-grade MongoDB cluster and `JWT_SECRET` is sufficiently random and stored securely.

--

**Contributing**

Contributions are welcome. Please open issues for bugs or feature requests and submit pull requests for improvements.

--

**License**

This project is provided under the terms in the repository `LICENSE` file.


