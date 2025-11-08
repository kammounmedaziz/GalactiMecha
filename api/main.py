"""FastAPI application entrypoint for GalactiMecha."""
from fastapi import FastAPI

from api.routes.example import router as example_router

app = FastAPI(title="GalactiMecha API")


@app.get("/health")
async def health():
    return {"status": "ok"}


# Include example routes under /api
app.include_router(example_router, prefix="/api")
