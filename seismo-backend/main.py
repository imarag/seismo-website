from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from config import Settings
from routers import (
    file_services,
    seismic_operations,
    signal_processing,
    trace_management,
)

settings = Settings.from_toml("pyproject.toml")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:  # noqa: ARG001
    settings.initialize_app()
    yield


app = FastAPI(lifespan=lifespan)

api_prefix = "/api"

# include the routers
app.include_router(
    file_services.router, prefix=api_prefix + "/file-services", tags=["File Services"]
)
app.include_router(
    seismic_operations.router,
    prefix=api_prefix + "/seismic-operations",
    tags=["seismic-operations"],
)
app.include_router(
    signal_processing.router,
    prefix=api_prefix + "/signal-processing",
    tags=["signal processing"],
)
app.include_router(
    trace_management.router,
    prefix=api_prefix + "/trace-management",
    tags=["Trace Management"],
)
app.mount("/", StaticFiles(directory="dist", html=True), name="frontend")


# this is for raising httpexception errors
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc) -> JSONResponse:  # noqa: ANN001, ARG001
    return JSONResponse(status_code=404, content={"error_message": str(exc.detail)})


# this is for errors related to validations of pydantic
# return the errors are comma separated strings
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc) -> JSONResponse:  # noqa: ANN001, ARG001
    errors = exc.errors()
    return JSONResponse(
        status_code=400,
        content={"error_message": ", ".join([f"{err['msg']}" for err in errors])},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=int(settings.port),
        use_colors=False,
        reload=True,
    )
