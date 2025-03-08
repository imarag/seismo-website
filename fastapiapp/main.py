from routers import core, signal_processing, handle_seismic_traces
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI()

# include the routers
app.include_router(signal_processing.router)
app.include_router(handle_seismic_traces.router)
app.include_router(core.router)

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
            status_code=404,
            content={"error_message": [err["msg"] for err in errors]}
        )

# set the cors
origins = [
    "https://seismo-website.onrender.com",
    "http://seismo-website.onrender.com",
    "https://seismo-website.vercel.app",
    "http://seismo-website.vercel.app",
    "https://127.0.0.1:8000",
    "http://127.0.0.1:8000",
    "https://127.0.0.1:5000",
    "http://127.0.0.1:5000",
    "https://127.0.0.1:5175",
    "http://127.0.0.1:5175",
    "https://127.0.0.1:3000",
    "http://127.0.0.1:3000",
    "https://localhost:5000",
    "http://localhost:5000",
    "https://localhost:5175",
    "http://localhost:5175",
    "https://localhost:8000",
    "http://localhost:8000",
    "https://localhost:3000",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True, log_level="info")