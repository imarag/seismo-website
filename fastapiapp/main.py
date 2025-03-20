from fastapi import FastAPI
from routers import core, signal_processing, handle_seismic_traces
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager
import toml
from internal.config import Settings

toml_data = toml.load('config.toml')

@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = Settings()
    settings.initialize_folders()
    yield
    
app = FastAPI(
    title=toml_data["project-info"]["name"],
    description=toml_data["project-info"]["description"],
    summary=toml_data["project-info"]["summary"],
    version=toml_data["project-info"]["version"],
    contact={
        "name": toml_data["contact"]["name"],
        "url": toml_data["contact"]["url"],
        "email": toml_data["contact"]["email"],
    },
    license_info={
        "name": toml_data["licence"]["name"],
        "url": toml_data["licence"]["url"],
    },
)

origins = [
    "https://seismo-website.vercel.app",
    "http://seismo-website.vercel.app",
    "https://127.0.0.1:5173",
    "http://127.0.0.1:5173",
    "https://localhost:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signal_processing.router)
app.include_router(handle_seismic_traces.router)
app.include_router(core.router)

# this is for raising httpexception errors
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(Request, exc):
    return JSONResponse(
        status_code=404,
        content={"error_message": [str(exc.detail)]},
    )

# this is for errors related to validations of pydantic
# return the errors are comma separated strings
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(Request, exc):
    errors = exc.errors()
    return JSONResponse(
        status_code=400,
        content={"error_message": [f'{err["msg"]}' for err in errors]}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True, log_level="info")