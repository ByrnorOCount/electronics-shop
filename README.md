# Electronics Shop

## Run locally on Windows

### Prerequisites

- Node.js and npm
- PostgreSQL

### 1. Configure environment files

From the project root, copy the example files:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Edit `backend\.env` with your PostgreSQL username, password, and database name. Configure Stripe test keys if you want to test online payments. The backend also requires the Google and Facebook OAuth environment variables to be present; real provider credentials are only needed to use those login methods.

The default frontend API URL is `http://localhost:3001/api`. Change `VITE_API_BASE_URL` in `frontend\.env` only if your backend uses a different address.

### 2. Create and migrate the database

Create the PostgreSQL database named in `backend\.env` (for example, `electronics_shop`) using pgAdmin or `createdb`, then run:

```powershell
npm install
npm run migrate --workspace=backend
```

To load development sample data, run:

```powershell
npm run seed --workspace=backend
```

### 3. Start the application

From the project root:

```powershell
npm run dev
```

- Frontend: <http://localhost:3100>
- Backend: <http://localhost:3001>

The command runs both development servers. Use `Ctrl+C` to stop them.

## Run tests and builds

Backend tests use a separate `electronics_shop_test` database. The test command creates it if needed and applies migrations. The PostgreSQL user must have permission to create databases.

```powershell
npm test --workspace=backend
npm run build --workspace=frontend
```

## Local test accounts and Stripe card

The development seed creates these demo accounts, all using the seeded password `Password123!`:

- Admin: `admin@example.com`
- Staff: `staff@example.com`
- Customer: `john.doe@example.com`

For Stripe test checkout, use the test Visa card `4242 4242 4242 4242`, any future expiration date (for example `12/34`), and CVC `567`. Use test-mode Stripe keys only; never use real payment details for local testing.

## Debugging

- **Backend startup or database errors:** Check `backend\.env`, confirm PostgreSQL is running, and verify the configured database exists and is reachable.
- **“Column does not exist” after updating code:** Run `npm run migrate --workspace=backend` against the development database, then restart the backend. Confirm `NODE_ENV=development` and that `DB_DATABASE` is the database used by the app.
- **Frontend API errors:** Confirm the backend is listening on port 3001 and `VITE_API_BASE_URL` points to it. Restart Vite after changing `frontend\.env`.
- **Inspect backend logs:** Development logs appear in the backend terminal and are also written to `backend\logs\all.log` and `backend\logs\error.log`.
- **Stripe checkout stays on “Processing Your Order”:** Payment completion is delivered to the backend by a webhook. Install the Stripe CLI, run `stripe login`, then keep this running in a separate PowerShell window:

  ```powershell
  stripe listen --forward-to http://localhost:3001/api/orders/webhook
  ```

  Set the printed `whsec_...` value as `STRIPE_WEBHOOK_SECRET` in `backend\.env`, restart the backend, and retry with a new Stripe test session.
- **Local shipping:** Shipping quotes are simulated from the selected delivery zone and parcel weight. No carrier account or external shipping API is used.

## Optional: local product assistant

The product assistant requires [Ollama for Windows](https://ollama.com/download). Install and start Ollama, then download the default model:

```powershell
ollama pull llama3.2
```

The defaults are `OLLAMA_BASE_URL=http://127.0.0.1:11434` and `OLLAMA_MODEL=llama3.2` in `backend\.env.example`. If the assistant reports a connection error, check that Ollama is running and that the configured URL and model are available.
