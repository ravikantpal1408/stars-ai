import fastapi
import uvicorn
from contextlib import asynccontextmanager
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.src.routes_config import router as api_endpoint_router
from backend.src.config.events import initialize_db_connection, dispose_db_connection
from backend.src.config.manager import settings
from starlette.exceptions import HTTPException as StarletteHTTPException

@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    # Startup: Initialize DB connection
    await initialize_db_connection(backend_app=app)
    yield
    # Shutdown: Dispose DB connection
    await dispose_db_connection(backend_app=app)

def initialize_backend_application() -> fastapi.FastAPI:
    app = fastapi.FastAPI(**settings.set_backend_app_attributes, lifespan=lifespan)  # type: ignore

    @app.exception_handler(StarletteHTTPException)
    async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
        if exc.status_code == 404:
            return JSONResponse(
                status_code=404,
                content={
                    "message": "Oops! This endpoint does not exist.",
                    "path": request.url.path,
                    "suggestion": "Check /docs for available endpoints"
                },
            )
        return await fastapi.exception_handlers.http_exception_handler(request, exc)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=settings.IS_ALLOWED_CREDENTIALS,
        allow_methods=settings.ALLOWED_METHODS,
        allow_headers=settings.ALLOWED_HEADERS,
    )

    app.include_router(router=api_endpoint_router, prefix=settings.API_PREFIX)

    return app


stars_app: fastapi.FastAPI = initialize_backend_application()

if __name__ == "__main__":
    uvicorn.run(
        app="main:stars_app",
        host="127.0.0.1",
        port="8000",
        reload=settings.DEBUG,
        workers=settings.SERVER_WORKERS,
        log_level=settings.LOGGING_LEVEL,
    )