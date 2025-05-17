from fastapi import FastAPI
from routers import core, signal_processing, handle_seismic_traces
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Global prefix
api_prefix = "/api"

# include the routers
app.include_router(
    signal_processing.router,
    prefix=api_prefix + "/signal-processing",
    tags=["signal processing"],
)
app.include_router(
    handle_seismic_traces.router,
    prefix=api_prefix + "/handle-seismic-traces",
    tags=["handle seismic traces"],
)
app.include_router(core.router, prefix=api_prefix + "/core", tags=["Core"])

app.mount("/", StaticFiles(directory="dist", html=True), name="frontend")


# this is for raising httpexception errors
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error_message": [str(exc.detail)]},
    )


# this is for errors related to validations of pydantic
# return the errors are comma separated strings
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = exc.errors()
    return JSONResponse(
        status_code=400, content={"error_message": [f'{err["msg"]}' for err in errors]}
    )


HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=HOST, port=PORT, log_level="info")
