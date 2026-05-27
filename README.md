# Ecoberg

React + FastAPI environmental intelligence dashboard.

## Frontend

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api/*` requests to `http://127.0.0.1:8000`.

## Backend

```bash
npm run setup:api
npm run dev:api
```

Use the setup script instead of system-wide `pip install`; it avoids Debian/Ubuntu's PEP 668 externally-managed Python error by installing through the project `.venv`.

Backend docs: `http://localhost:8000/api/docs`

Health check: `http://localhost:8000/api/health`
