# GalactiMecha: Armored AI for interstellar challenges

GalactiMecha: Armored AI for interstellar challenges

This repository contains the scaffold for the GalactiMecha project — an Armored AI platform designed to tackle interstellar challenges. This scaffold includes a Python AI package, an Express.js backend, and a React frontend starter.

See the folders `ai/`, `api/`, and `web/` for starter code and instructions.

## Run API + MongoDB with Docker Compose (dev)

If you don't have MongoDB locally you can run MongoDB in Docker and the API together using Docker Compose.

1. Make sure Docker is installed and running.
2. From the project root run:

```powershell
docker compose up --build
```

This starts:
- MongoDB on localhost:27017 (data persisted in a Docker volume)
- API on localhost:8000

Verify:
- Health: http://localhost:8000/health
- Example: http://localhost:8000/example
- DB test: http://localhost:8000/db-test

Notes:
- The API reads the MongoDB connection string from the `MONGO_URI` env var. The compose file sets it to `mongodb://mongo:27017/galactimecha` which points at the `mongo` service in the compose network.
- The `./api` folder is mounted into the container for easy local edits. If you change `package.json`, rebuild with `docker compose build api`.

## Run the frontend (React) in dev mode

From a separate terminal (the API + MongoDB are started by the compose command above):

```powershell
cd web
npm install
npm run dev
```

The React dev server runs on `http://localhost:3000` by default. The frontend will call the API on `http://localhost:8000` (CORS is enabled in the API).

