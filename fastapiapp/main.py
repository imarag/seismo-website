from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import signal_processing, handle_seismic_traces, utilities

app = FastAPI()

# include the routers
app.include_router(signal_processing.router)
app.include_router(handle_seismic_traces.router)
app.include_router(utilities.router)


# set the cors
origins = [
    "https://seismo-website.onrender.com",
    "http://seismo-website.onrender.com",
    "https://seismo-website.vercel.app",
    "http://seismo-website.vercel.app",
    "https://127.0.0.1:8000",
    "http://127.0.0.1:8000",
    "https://127.0.0.1:3000",
    "http://127.0.0.1:3000",
    "https://localhost:8000",
    "http://localhost:8000",
    "https://localhost:3000",
    "http://localhost:3000"
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
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)