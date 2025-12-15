#!/bin/sh

# This script is the entrypoint for the backend Docker container.
# It ensures the database is ready and migrations are run before starting the application.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running database migrations..."
npm run migrate

echo "Running database seeds..."
npm run seed

echo "Migrations and seeds complete. Starting the server..."

# Execute the command passed to this script (e.g., `npm run start`)
exec "$@"
