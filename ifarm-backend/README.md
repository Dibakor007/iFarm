# iFarm Backend

Express-based service that exposes MySQL-backed APIs for the iFarm client. The project is designed to run alongside the existing Vite frontend but lives in its own folder so it can start independently.

## Quick start
1. Open a terminal in this folder (`cd ifarm-backend`).
2. Run `npm install` to grab dependencies.
3. Copy `.env` into `.env.local` and fill in your XAMPP credentials (host, port, user, password, database name).
4. Start your XAMPP MySQL server and ensure the database referenced in `.env` exists.
5. Run `npm run dev` for hot reloading or `npm start` to launch the production build.

## Database guidance
The backend expects a table called `farms` with at least `id`, `name`, and `status` columns. You can create it using the following SQL snippet if it does not already exist:

```sql
CREATE TABLE IF NOT EXISTS farms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'idle',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Adjust the table name or fields if you already have a different schema; just update the `src/models/farmModel.js` queries accordingly.

## Database connection
1. Start the XAMPP Control Panel and make sure the MySQL service is running on the host/port pair you plan to use (default `localhost:3306`).
2. Open `%xampp%/mysql/bin/mysql` or phpMyAdmin and confirm the database named in `DB_NAME` exists; create it manually if needed before running the backend.
3. Update the values in `.env` so that `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` match the XAMPP credentials you just verified (the sample `.env` defaults assume an empty password for the `root` user).
4. Run `npm run dev` (or `npm start`) from the `ifarm-backend` folder once the `.env` file is configured; the server performs a database health check during boot and will log a failure if it cannot connect.
5. Hit `GET http://localhost:4000/health` after the server starts to ensure the backend can still reach the MySQL instance; this endpoint reuses the same pooled connection handling described in `src/config/database.js`.

## API preview
- `GET /api/v1/farms` – returns the first 50 rows from `farms` (useful for dashboards).
- `GET /health` – verifies the app can reach the database.

Front-end apps can point to the backend by setting `API_BASE_PATH` or directly hitting `http://localhost:4000/api/v1` once this server is running.
